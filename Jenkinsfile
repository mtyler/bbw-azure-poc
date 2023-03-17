pipeline {
  agent any
  environment {
      ACR='bbwcr.azurecr.io'
      RGROUP='BBW-DEV'
      AKS='BBW-AKS-1'
      SERVICE='poc'
  }
  stages {
    stage('Build and Push') {
      options {
          azureKeyVault([[envVariable: 'BBWCR_KEY', name: 'bbwcr', secretType: 'Secret']])
      }
      steps {
        sh '''
          echo "Build and Push"
          docker build -t $ACR/:$BUILD_NUMBER $WORKSPACE/.
          docker login -u bbwcr -p $BBWCR_KEY $ACR
          docker push $ACR/$SERVICE:$BUILD_NUMBER
        '''
      }
    }
    stage('Deploy') {
      steps {
        sh '''
          echo "Deploy"
          az aks get-credentials -g $RGROUP -n $AKS 
          kubectl cluster-info
          helm upgrade $SERVICE $SERVICE/ --install --create-namespace -n qa -f $WORKSPACE/sfdemo/values.yaml --set image.tag=$BUILD_NUMBER
        '''
      }
    }
    stage('Smoke Test') {
      steps {
        script {
          echo "Smoke Test"
          RESULT = sh (
                script: 'curl http://$(kubectl get svc --namespace qa app --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}"):8080',
                returnStdout: true
            ).trim()
          echo "test result: ${RESULT}"
        }
      }
    }
  }
} //pipeline
