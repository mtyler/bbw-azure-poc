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
# has the Owner role in the subscription.  The script uses these extant
# resources to provision additional resources including an Azure Container
# Registry and an AKS cluster and then builds and deploys this project's
# artifact into the AKS cluster as a kubernetes service. 

echo Hello!

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
# This step is not required in the Azure Cloud Shell.
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

echo 'To test the service, run:
  export SERVICE_IP=$(kubectl get svc --namespace default sfdemo-chart --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
Then run:
  echo http://$SERVICE_IP:8080
Then append /sfdemo/dress to the resulting URL and have your browser or a tool like curl or wget GET  it and see if you get a JSON payload in response.
You can also verify the service by running:
  az aks get-credentials -g $ResourceGroup -n $AKSCluster
and then running:
  kubectl get services
and scanning the output for a service named sfdemo-chart.'

exit 0