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
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
            }
        }

        stage('Stop Old Container') {
            steps {
                sh "docker rm -f ${CONTAINER_NAME} || true"
            }
        }

        stage('Run Container') {
            steps {
                sh """
                docker run -d -p ${APP_PORT}:3000 \
                --name ${CONTAINER_NAME} \
                ${IMAGE_NAME}:${BUILD_NUMBER}
                """
            }
        }

        stage('Wait for App') {
            steps {
                sh 'sleep 15'
            }
        }

        stage('Trigger Tests') {
            steps {
                sh """
                curl -X POST http://localhost:${APP_PORT}/execute \
                -H "Content-Type: application/json" \
                -d '{"suite":"smoke","env":"qa","tags":["login"]}'
                """
            }
        }
    }

    post {
        always {
            sh "docker logs ${CONTAINER_NAME} || true"
        }
        cleanup {
            sh "docker rm -f ${CONTAINER_NAME} || true"
        }
    }
}
