pipeline {
  agent {
    docker {
      image 'node:20'
      args '-v /var/run/docker.sock:/var/run/docker.sock'
    }
  }

  options {
    timestamps()
  }

  environment {
    IMAGE_NAME = "cognitest-engine"
    CONTAINER_NAME = "cognitest-container"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Validate') {
      steps {
        sh 'npm run lint || true'
        sh 'npm run typecheck'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
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

    stage('Trigger Execution') {
      steps {
        sh '''
        sleep 15
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
