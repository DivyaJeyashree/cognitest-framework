pipeline {
  agent any

  environment {
    IMAGE_NAME = "cognitest"
    CONTAINER_NAME = "cognitest-container"
  }

  stages {

    stage('Clean Workspace') {
      steps {
        deleteDir()
      }
    }

    stage('Checkout') {
      steps {
        git url: 'https://github.com/DivyaJeyashree/cognitest-framework.git', branch: 'main'
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t $IMAGE_NAME:${BUILD_NUMBER} .'
      }
    }

    stage('Run Container') {
      steps {
        sh '''
        docker stop $CONTAINER_NAME || true
        docker rm $CONTAINER_NAME || true
        docker run -d -p 3000:3000 --name $CONTAINER_NAME $IMAGE_NAME:${BUILD_NUMBER}
        '''
      }
    }

    stage('Trigger Test Execution') {
      steps {
        sh '''
        sleep 10
        curl -X POST http://localhost:3000/execute \
        -H "Content-Type: application/json" \
        -d '{"suite":"smoke","env":"qa","tags":["login"]}'
        '''
      }
    }
  }

  post {
    always {
      sh 'docker logs $CONTAINER_NAME || true'
    }
  }
}
