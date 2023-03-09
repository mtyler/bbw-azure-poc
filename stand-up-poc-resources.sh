#!/bin/bash
# This script runs Azure CLI commands to stand up the resources needed for
# the middle tier proof of concept of a managed API fronting a containerized
# Express.js app (a "microservice") deployed as a service on an AKS cluster.
#
# The step to create an AKS cluster requires this script to be run by an
# account with the Owner role on the target Azure subscription.
#
# This script assumes the existence of an Azure tenant (billing account)
# with a subscription containing a resource group, and a user account that
# has the Owner role in the subscription.  (It could just as easily create
# those resources as well if desired, but that's a matter of working out
# security policies beyond the concerns of this proof of concept.  For that
# matter, it could also clone the GitHub project cited below.)
#
# The script uses these extant resources to provision additional resources
# including an Azure Container Registry and an Azure Kubernetes Service (AKS)
# cluster and then builds and deploys this project's application artifact into
# the AKS cluster as a kubernetes service.
#
# Next, it creates an Azure API Management (APIM) Service instance, creates
# an APIM API that invokes the AKS service, defines an APIM product, and
# publishes the API by adding it to the APIM product.
#
# That's a lot for one script.  In a real world (production) scenario, we could
# modularize (and parameterize) these steps and wrap them in some orchestration
# that can make outcome-based decisions and be paused/resumed at various steps.

read -rep $'Before running this script, please make sure that you have run
git clone https://github.com/jfausey/azure-bbw-poc-static-web-app.git
and that the current working directory is the root directory of the cloned
project. You must also run it on a system that has the Azure CLI installed.
Continue [y]?: ' ans
ANSWER=${ans:-y}

if [ $ANSWER == y ]
then
    echo Continuing.
else
    echo Stopping.
    exit 1
fi

# Define several variables whose values are parameters to Azure CLI commands.
# TODO: Could make these command-line parameters to this script.
ResourceGroup=bbw-sbxomni-apim-nonprod-eastus2-rg
ContainerRegistry=bbwcr
AKSCluster=BBW-AKS-1
ImageName=k8s-poc-sfdemo
HelmChart=sfdemo
APIM=bbwapimpoc
PublisherName=BBW
PublisherEmail=jfausey@contractor.bbw.com
ApiId=apparel
ApiPath='/apparel'
ApiDisplayName='Apparel Demo'
ApiDescription='Access the Salesforce Apparel demo API'
ApiOperation=search
ApiProductName='BBW POC'
ApiProductId=bbw-poc

# Create an Azure Container Registry
az acr create -g $ResourceGroup -n $ContainerRegistry --sku Basic

if [ $? -eq 0 ]
then
    echo "Successfully created container registry."
else
    echo "Could not create container registry" >&2
    exit 2
fi

# Create an AKS cluster with access to the new container registry.
# This step requires Owner role at the Azure subscription level.
az aks create -g $ResourceGroup -n $AKSCluster --location eastus --attach-acr $ContainerRegistry --generate-ssh-keys --enable-addons http_application_routing

if [ $? -eq 0 ]
then
    echo "Successfully created AKS cluster."
else
    echo "Could not create AKS cluster.  Do you have the required Owner role at the Azure subscription level?" >&2
    exit 3
fi

# Install kubectl locally using the az aks install-cli command:
# This step is not required if this script is run in the Azure Cloud Shell
# or any shell on a system with the aks CLI already installed.
#az aks install-cli

# Configure kubectl to connect to your Kubernetes cluster using the following command example to gets credentials for the AKS cluster:
az aks get-credentials -g $ResourceGroup -n $AKSCluster

if [ $? -eq 0 ]
then
    echo "Successfully connected kubectl to the AKS cluster."
else
    echo "Could not connect kubectl to the AKS cluster." >&2
    exit 4
fi

# Build the sample application, package it as a Docker container image and push it to the Azure Container Registry.
az acr build --image $ImageName --registry $ContainerRegistry --file Dockerfile .

if [ $? -eq 0 ]
then
    echo "Successfully built and pushed the Docker image."
else
    echo "Could not build and push the Docker image." >&2
    exit 5
fi

# Deploy the Docker container image from the Azure Container Registry to the AKS cluster.
helm install $HelmChart $HelmChart/

if [ $? -eq 0 ]
then
    echo "Successfully deployed the service to the AKS cluster."
else
    echo "Could not deploy the service to the AKS cluster." >&2
    exit 6
fi

echo 'To test the AKS service, run:
  export SERVICE_IP=$(kubectl get svc --namespace default sfdemo-chart --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
Then run:
  echo http://$SERVICE_IP:8080
Then append /sfdemo/dress to the resulting URL and have your browser or a tool like curl or wget GET  it and see if you get a JSON payload in response.
You can also verify the service by running:
  az aks get-credentials -g $ResourceGroup -n $AKSCluster
and then running:
  kubectl get services
and scanning the output for a service named sfdemo-chart.'

ServiceIP=$(kubectl get svc --namespace default sfdemo-chart --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
ApiServiceUrl=http://$ServiceIp:8080

# Create an Azure API Management Service (APIM) instance
az apim create -g $ResourceGroup -n $APIM --publisher-name $PublisherName --publisher-email $PublisherEmail

if [ $? -eq 0 ]
then
    echo "Successfully created an APIM instance."
else
    echo "Could not create an APIM instance." >&2
    exit 7
fi

# Create an APIM API
# See https://learn.microsoft.com/en-us/cli/azure/apim/api?view=azure-cli-latest#az-apim-api-create
# TODO: Single-quote the args below?
az apim api create -n $APIM -g $ResourceGroup --api-id $ApiId --path $ApiPath --display-name $ApiDisplayName --description $ApiDescription --service-url $ApiServiceUrl

if [ $? -eq 0 ]
then
    echo "Successfully created an APIM API."
else
    echo "Could not create an APIM API." >&2
    exit 8
fi

# Create the API's search operation
az apim api operation create -g $ResourceGroup -n $APIM --api-id $ApiId --url-template '/{param1}' --method 'GET' --display-name 'Apparel Search' --description 'Search the Salesforce Apparel demo API' --template-parameters name=param1 description='search term' type=string required='true'

if [ $? -eq 0 ]
then
    echo "Successfully created an APIM API operation."
else
    echo "Could not create an APIM API operation." >&2
    exit 9
fi

echo "To test the API's search operation, GET https://$APIM.azure-api.net/apparel/search/dress"

# Create an APIM product
az apim product create -g $ResourceGroup -n $APIM --product-name $ApiProductName --product-id $ApiProductId --subscription-required false --state published --description 'Managed API POC for BBW'

if [ $? -eq 0 ]
then
    echo "Successfully created an APIM product."
else
    echo "Could not create an APIM product." >&2
    exit 10
fi

# Add the API to the APIM product (publish it):
az apim product api add -g $ResourceGroup -n $APIM --api-id $ApiId --product-id $ApiProductId

if [ $? -eq 0 ]
then
    echo "Successfully added an APIM API to an APIM product."
else
    echo "Could not add an APIM API to an APIM product." >&2
    exit 11
fi

echo "To list the APIM products to verify the new one was added, run:
az apim product api list -g $ResourceGroup -n $APIM --product-id $ApiProductId --output table"

echo "To demonstrate the API, GET https://$APIM.azure-api.net/apparel/search/dress
to invoke the search operation of API to query the Salesforce Apparel demo API
for dress and you should get a JSON response containing the search results.
Change "dress" to "shirt" or "pants" to see different results."

exit 0