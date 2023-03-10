#!/bin/bash
# This script runs Azure CLI commands to stand up the resources needed for
# a middle tier proof of concept of a managed API fronting a containerized
# Express.js app (a "microservice") deployed as a service on an AKS cluster.
#
# The step to create an AKS cluster requires this script to be run by an
# account with the Owner role on the target Azure subscription.
#
# This script assumes the existence of an Azure tenant (billing account)
# with a subscription containing a resource group, and a user account that
# has the Owner role in the subscription.  It could just as easily create
# those resources as well if desired, but that's a matter of working out
# security policies beyond the scope of this proof of concept.  For that
# matter, it could also clone the GitHub project cited below.
#
# The script uses these extant resources to provision additional resources
# including an Azure Container Registry and an Azure Kubernetes Service (AKS)
# cluster and then builds and deploys this project's application artifact into
# the AKS cluster as a kubernetes service.
#
# Next, it creates an Azure API Management (APIM) Service instance, creates
# an APIM API with an operation that invokes the AKS service, defines an APIM
# product, and publishes the API by adding it to the APIM product.
#
# That's a lot for one script!  In a production scenario, we would modularize
# each step as a separate script, enable them to accept parameters, and make
# them steps in orchestration code in a tool that can make outcome-based
# decisions for each step and can be paused/resumed at any step.

# Define several variables whose values are parameters to Azure CLI commands.
# TODO: Could make these command-line parameters to this script.
ResourceGroup=bbw-sbxomni-apim-nonprod-eastus2-rg
ContainerImage=k8s-poc-sfdemo
ContainerRegistry=bbwpoccr
AksCluster=BBW-AKS-1
# Not used: AksClusterSubnet=bbw-sboxomni-nonprod-AKS-10.219.252.0_25
HelmChart=sfdemo
ApimInstance=bbwapimpoc
# Not used: ApimSubnet=bbw-sboxomni-nonprod-APIM-10.219.252.128_27
# Not used: AppGatewaySubnet=bbw-sboxomni-nonprod-Azure-App-Gateway-10.219.252.160_28
PublisherName=BBW
PublisherEmail=jfausey@contractor.bbw.com
ApiId=apparel
ApiPath='/apparel'
ApiDisplayName="'Apparel Demo'"
ApiDescription="'Access the Salesforce Apparel demo API'"
ApiOperation=search
ApiProductName="'BBW POC'"
ApiProductId=bbw-poc

# Confirm the basic requirements.
read -rep $'Before running this script:
  1) Read through it so you understand what it does and how it does it.
  2) Make sure that you have run
       git clone https://github.com/jfausey/azure-bbw-poc-static-web-app.git
  3) Make sure that the current working directory is the root directory of
     the cloned project.
  4) Make sure that it is runing on a system that has the Azure CLI installed.
Continue [y]?: ' ans
ANSWER=${ans:-y}

if [ $ANSWER == y ]
then
    echo Continuing.
else
    echo Stopping.
    exit 1
fi

# Create an Azure Container Registry?
read -rep $"Create an Azure Container Registry as follows?
  az acr create -g $ResourceGroup -n $ContainerRegistry --sku Basic
Enter y (default) to continue. Enter anything else to skip this step: " ans
ANSWER=${ans:-y}

if [ $ANSWER == y ]
then
    echo "Creating an Azure Container registry."
    az acr create -g $ResourceGroup -n $ContainerRegistry --sku Basic
    if [ $? -eq 0 ]
    then
        echo "Successfully created a container registry."
    else
        echo "Could not create a container registry" >&2
        exit 2
    fi
else
    echo "Step skipped."
fi

# Create an AKS cluster with access to the new container registry?
# This step requires Owner role at the Azure subscription level.
read -rep $"Create an AKS cluster as follows?
  az aks create -g $ResourceGroup -n $AksCluster --location eastus
    --attach-acr $ContainerRegistry --generate-ssh-keys
    --enable-addons http_application_routing
NOTE: This step requires Owner role at the Azure subscription level.
Enter y (default) to continue. Enter anything else to skip this step: " ans
ANSWER=${ans:-y}

if [ $ANSWER == y ]
then
    # Creating a private AKS cluster with access to a container registry per
    # https://learn.microsoft.com/en-us/azure/aks/private-clusters#advanced-networking
    # would introduce several limitations
    # (https://learn.microsoft.com/en-us/azure/aks/private-clusters#limitations)
    # whose workarounds are beyond the scope of the POC.
    echo "Creating an AKS cluster. Please be patient - this can take a while."
    az aks create -g $ResourceGroup -n $AksCluster --location eastus --attach-acr $ContainerRegistry --generate-ssh-keys --enable-addons http_application_routing
    if [ $? -eq 0 ]
    then
        echo "Successfully created an AKS cluster."
    else
        echo "Could not create an AKS cluster.  Do you have the required Owner role at the Azure subscription level?" >&2
        exit 3
    fi
else
    echo "Step skipped."
fi

# Install kubectl locally.
# This step is not required if this script is run in the Azure Cloud Shell
# or any shell on a system with the aks CLI already installed.
#az aks install-cli

# Configure kubectl to connect to your Kubernetes cluster?
read -rep $"Configure kubectl to connect to your Kubernetes cluster as follows?
  az aks get-credentials -g $ResourceGroup -n $AksCluster
Enter y (default) to continue. Enter anything else to skip this step: " ans
ANSWER=${ans:-y}

if [ $ANSWER == y ]
then
    echo "Configuring kubectl to connect to your Kubernetes cluster."
    az aks get-credentials -g $ResourceGroup -n $AksCluster
    if [ $? -eq 0 ]
    then
        echo "Successfully connected kubectl to the AKS cluster."
    else
        echo "Could not connect kubectl to the AKS cluster." >&2
        exit 4
    fi
else
    echo "Step skipped."
fi

# Build the sample application, package it as a Docker container image,
# and push it to the Azure Container Registry?
read -rep $"Build the sample application, package it as a Docker container image,
and push it to the Azure Container Registry as follows?
  az acr build --image $ContainerImage --registry $ContainerRegistry --file Dockerfile .
Enter y (default) to continue. Enter anything else to skip this step: " ans
ANSWER=${ans:-y}

if [ $ANSWER == y ]
then
    echo "Building and registering a container image."
    az acr build --image $ContainerImage --registry $ContainerRegistry --file Dockerfile .
    if [ $? -eq 0 ]
    then
        echo "Successfully built and registered the container image."
    else
        echo "Could not build and register the container image." >&2
        exit 5
    fi
else
    echo "Step skipped."
fi

# TODO: Automate the following variable substitution into $HelmChart/values.yaml
# instead of making the user do it.
read -rep $"Make sure that the image.repository value in $HelmChart/values.yaml
is $ContainerRegistry.azurecr.io/$ContainerImage.
Press enter to continue." foo

# Deploy the container image from the Azure Container Registry to the AKS cluster?
read -rep $"Deploy the container image from the Azure Container Registry to the
AKS cluster as follows?
  helm install $HelmChart $HelmChart/
Enter y (default) to continue. Enter anything else to skip this step: " ans
ANSWER=${ans:-y}

if [ $ANSWER == y ]
then
    echo "Deploying the container image from the Azure Container Registry to the AKS cluster."
    helm install $HelmChart $HelmChart/
    if [ $? -eq 0 ]
    then
        echo "Successfully deployed the service to the AKS cluster."
    else
        echo "Could not deploy the service to the AKS cluster." >&2
        exit 6
    fi
else
    echo "Step skipped."
fi

ServiceIP=$(kubectl get svc --namespace default sfdemo-chart --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
ApiServiceUrl=http://$ServiceIp:8080

read -rep $"GET $ApiServiceUrl with a browser or a tool like curl or wget and
see if you get a JSON payload in response.
You can also verify that the service was deployed by running:
  az aks get-credentials -g $ResourceGroup -n $AksCluster
and then running:
  kubectl get services
and scanning the output for a service named sfdemo-chart.
Press enter to continue." foo

# Create an Azure API Management Service (APIM) instance?
read -rep $"Create an Azure API Management Service (APIM) instance as follows?
  az apim create -g $ResourceGroup -n $ApimInstance
    --publisher-name $PublisherName --publisher-email $PublisherEmail
Enter y (default) to continue. Enter anything else to skip this step: " ans
ANSWER=${ans:-y}

if [ $ANSWER == y ]
then
    # Creating an APIM instance in an internal virtual network with an Application
    # Gateway per https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-integrate-internal-vnet-appgateway
    # is beyond the scope of the POC.  We'll keep it simple for now.
    echo "Creating an Azure API Management Service (APIM) instance."
    az apim create -g $ResourceGroup -n $ApimInstance --publisher-name $PublisherName --publisher-email $PublisherEmail
    if [ $? -eq 0 ]
    then
        echo "Successfully created an APIM instance."
    else
        echo "Could not create an APIM instance." >&2
        exit 7
    fi
else
    echo "Step skipped."
fi

# Create an APIM API?
# See https://learn.microsoft.com/en-us/cli/azure/apim/api?view=azure-cli-latest#az-apim-api-create.
read -rep $"Create an APIM API as follows?
  az apim api create -n $ApimInstance -g $ResourceGroup
    --api-id $ApiId --path $ApiPath --display-name $ApiDisplayName
    --description $ApiDescription --service-url $ApiServiceUrl
Enter y (default) to continue. Enter anything else to skip this step: " ans
ANSWER=${ans:-y}

if [ $ANSWER == y ]
then
    echo "Creating an APIM API."
    az apim api create -n $ApimInstance -g $ResourceGroup --api-id $ApiId --path $ApiPath --display-name $ApiDisplayName --description $ApiDescription --service-url $ApiServiceUrl
    if [ $? -eq 0 ]
    then
        echo "Successfully created an APIM API."
    else
        echo "Could not create an APIM API." >&2
        exit 8
    fi
else
    echo "Step skipped."
fi

# Create the API's search operation?
read -rep $"Create the API's search operation as follows?
  az apim api operation create -g $ResourceGroup -n $ApimInstance
    --api-id $ApiId --url-template '/{param1}' --method 'GET'
    --display-name 'Apparel Search' --description 'Search the Salesforce Apparel demo API'
    --template-parameters name=param1 description='search term' type=string required='true'
Enter y (default) to continue. Enter anything else to skip this step: " ans
ANSWER=${ans:-y}

if [ $ANSWER == y ]
then
    echo "Creating an APIM API operation."
    az apim api operation create -g $ResourceGroup -n $ApimInstance --api-id $ApiId --url-template '/{param1}' --method 'GET' --display-name 'Apparel Search' --description 'Search the Salesforce Apparel demo API' --template-parameters name=param1 description='search term' type=string required='true'
    if [ $? -eq 0 ]
    then
        echo "Successfully created an APIM API operation."
    else
        echo "Could not create an APIM API operation." >&2
        exit 9
    fi
else
    echo "Step skipped."
fi

read -rep $"To test the API's search operation, GET https://$ApimInstance.azure-api.net/apparel/search/dress.
Press enter to continue." foo 

# Create an APIM product?
read -rep $"Create an APIM product as follows?
  az apim product create -g $ResourceGroup -n $ApimInstance
  --product-name $ApiProductName --product-id $ApiProductId
  --subscription-required false --state published
  --description 'Managed API POC for BBW'
Enter y (default) to continue. Enter anything else to skip this step: " ans
ANSWER=${ans:-y}

if [ $ANSWER == y ]
then
    echo "Creating an APIM product."
    az apim product create -g $ResourceGroup -n $ApimInstance --product-name $ApiProductName --product-id $ApiProductId --subscription-required false --state published --description 'Managed API POC for BBW'
    if [ $? -eq 0 ]
    then
        echo "Successfully created an APIM product."
    else
        echo "Could not create an APIM product." >&2
        exit 10
    fi
else
    echo "Step skipped."
fi

# Add the API to the APIM product (publish it)?
read -rep $"Create an APIM product as follows?
  az apim product api add -g $ResourceGroup -n $ApimInstance
  --api-id $ApiId --product-id $ApiProductId
Enter y (default) to continue. Enter anything else to skip this step: " ans
ANSWER=${ans:-y}

if [ $ANSWER == y ]
then
    echo "Adding an APIM API to an APIM product."
    az apim product api add -g $ResourceGroup -n $ApimInstance --api-id $ApiId --product-id $ApiProductId
    if [ $? -eq 0 ]
    then
        echo "Successfully added an APIM API to an APIM product."
    else
        echo "Could not add an APIM API to an APIM product." >&2
        exit 11
    fi
else
    echo "Step skipped."
fi

read -rep $"To list the APIM products to verify the new one was added, run:
  az apim product api list \
  -g $ResourceGroup \
  -n $ApimInstance \
  --product-id $ApiProductId \
  --output table
Press enter to continue." foo

echo "Script complete."

echo "To demonstrate the API, GET https://$ApimInstance.azure-api.net/apparel/search/dress
to invoke the search operation of API to query the Salesforce Apparel demo API
for dress and you should get a JSON response containing the search results.
Change dress to shirt or pants to see different results."

exit 0