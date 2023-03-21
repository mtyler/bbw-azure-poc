# bbw-azure-poc
A Demo Including

An Express.js app that searches the Salesforce demo Apparel API and returns a JSON payload containing the results, to be packaged in a container image, deployed as a Kubernetes service in an Azure Kubernetes Service cluster, and put behind an Azure API Management Service API.

A Demo Trunk-based CICD Pipeline deploying through multiple k8s environments...

A Demo Test...

## Usage
This repo is dependant upon an Azure subscription with all services configured and integrated.
ACR, AKS, Vault, VM, etc...

### Running locally
- git clone this repo
- npm install && npm run start && curl http://localhost:8080

### From Jenkins
- If you don't see your branch, click scan repository now
- look toward the bottom of the console logs for deployment information
- Development deployments run in a namespace = branch name
- note: Branch builds fail the first time through. Currently, researching a robust way to wait for service availability

## TODO


