pipeline {
    agent any

    environment {
        IMAGE_NAME = "cognitest"
        CONTAINER_NAME = "cognitest-container"
        NETWORK_NAME = "cogninet"
    }

    stages {

        stage('Clean Workspace') {
            steps { cleanWs() }
        }

        stage('Checkout Code') {
            steps { checkout scm }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
            }
        }

        stage('Create Network') {
            steps {
                sh "docker network create ${NETWORK_NAME} || true"
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
                docker run -d \
                --network ${NETWORK_NAME} \
                --name ${CONTAINER_NAME} \
                ${IMAGE_NAME}:${BUILD_NUMBER}
                """
            }
        }

        stage('Wait for App') {
            steps {
                sh 'sleep 20'
            }
        }

        stage('Trigger Tests') {
            steps {
                sh """
                curl -X POST http://${CONTAINER_NAME}:3000/execute \
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
