pipeline {
  agent any
  environment {
      ACR='bbwcr.azurecr.io'
      RGROUP='BBW-DEV'
      AKS='BBW-AKS-1'
      SERVICE='poc'
      TAG="${JOB_BASE_NAME}-${BUILD_NUMBER}"
  }
  stages {
    stage('Build') {
      steps {
        sh '''
            echo "Build"
            docker build -t $ACR/$SERVICE:$TAG $WORKSPACE/.
        '''    
      }
    }
    stage('Test') {
      steps {
        sh '''
            echo "Testing... Testing...  Testing...  Is this thing on?"
        '''    
      }
    }
    stage('Push') {
      options {
          azureKeyVault([[envVariable: 'BBWCR_KEY', name: 'bbwcr', secretType: 'Secret']])
      }
<<<<<<< HEAD
      when { 
          branch 'main'
=======
      steps {
        sh '''
          echo "Build and Push"
          docker build -t $ACR/$SERVICE:$TAG $WORKSPACE/.
          docker login -u bbwcr -p $BBWCR_KEY $ACR
          docker push $ACR/$SERVICE:$TAG
        '''
>>>>>>> main
      }
      steps {
         sh '''
            echo "Push"
            docker login -u bbwcr -p $BBWCR_KEY $ACR
            docker push $ACR/$SERVICE:$TAG
          '''
        }
    }
    stage('Deploy QA') {
      when { 
          branch 'main'
      }
      steps {
        sh '''
          echo "Deploy"
          az aks get-credentials -g $RGROUP -n $AKS 
          kubectl cluster-info
          helm upgrade $SERVICE $SERVICE/ --install --create-namespace -n qa -f $WORKSPACE/poc/values.yaml --set image.tag=$TAG --set image.pullPolicy=Always
        '''
      }
    }
    stage('Smoke Test') {
      steps {
        script {
          echo "Smoke Test"
          RESULT = sh (
                script: 'curl http://$(kubectl get svc --namespace qa $SERVICE --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}"):8080',
                returnStdout: true
            ).trim()
          echo "test result: ${RESULT}"
        }
      }
    }
  }
} //pipeline
