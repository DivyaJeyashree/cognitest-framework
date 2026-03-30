pipeline {
    agent any

    environment {
        IMAGE_NAME = "cognitest"
        CONTAINER_NAME = "cognitest-container"
        APP_PORT = "3000"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Clean Workspace') {
            steps {
                echo "Cleaning workspace..."
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                echo "Cloning repository..."
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image..."
                sh """
                docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .
                """
            }
        }

        stage('Stop Old Container') {
            steps {
                echo "Stopping old container if exists..."
                sh """
                docker rm -f ${CONTAINER_NAME} || true
                """
            }
        }

        stage('Run Container') {
            steps {
                echo "Starting new container..."
                sh """
                docker run -d -p ${APP_PORT}:3000 --name ${CONTAINER_NAME} ${IMAGE_NAME}:${BUILD_NUMBER}
                """
            }
        }

        stage('Wait for App') {
            steps {
                echo "Waiting for app to start..."
                sh "sleep 15"
            }
        }

        stage('Trigger Tests') {
            steps {
                echo "Triggering Cognitest execution..."
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
            echo "Fetching container logs..."
            sh "docker logs ${CONTAINER_NAME} || true"
        }

        cleanup {
            echo "Cleaning up container..."
            sh """
            docker stop ${CONTAINER_NAME} || true
            docker rm ${CONTAINER_NAME} || true
            """
        }
    }
}
