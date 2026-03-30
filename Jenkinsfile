pipeline {
    agent any

    environment {
        IMAGE_NAME = "cognitest"
        CONTAINER_NAME = "cognitest-container"
        APP_PORT = "3001"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                docker build -t cognitest:${BUILD_NUMBER} .
                '''
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                docker rm -f cognitest-container || true
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                docker run -d -p 3001:3000 \
                --name cognitest-container \
                cognitest:${BUILD_NUMBER}
                '''
            }
        }

        stage('Wait for App') {
            steps {
                sh 'sleep 30'
            }
        }

        stage('Trigger Tests') {
            steps {
                sh '''
                curl -X POST http://localhost:3001/execute \
                -H "Content-Type: application/json" \
                -d '{"suite":"smoke","env":"qa","tags":["login"]}'
                '''
            }
        }
    }

    post {
        always {
            sh "docker logs cognitest-container || true"
            sh "docker rm -f cognitest-container || true"
        }
    }
}
