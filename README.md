# bbw-azure-poc
An Express.js app that searches the Salesforce demo Apparel API and returns a JSON payload containing the results, to be packaged in a container image, deployed as a Kubernetes service in an Azure Kubernetes Service cluster, and put behind an Azure API Management Service API.

Regarding AKS set-up and deployment, see [Quickstart: Develop on Azure Kubernetes Service (AKS) with Helm](https://learn.microsoft.com/en-us/azure/aks/quickstart-helm?tabs=azure-cli.)
- Get access to an Azure subscription with an account that has the Contributor role so you can create and destroy the subsequent resources in isolation.
- Create an Azure Resource Group.
- Create an Azure Container Registry using the Azure CLI.
- Create an AKS cluster using the Azure CLI.
- Build and push the app to the ACR using the CLI.
- Create a Helm chart for the app.
- Run the Helm chart to deploy the app to the AKS cluster using the Azure CLI and Helm.
- Test/demo it.

See also [Use Azure API Management with microservices deployed in Azure Kubernetes Service](https://learn.microsoft.com/en-us/azure/api-management/api-management-kubernetes)