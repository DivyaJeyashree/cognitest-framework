pipeline {
    agent any

    environment {
        IMAGE_NAME = "cognitest"
        CONTAINER_NAME = "cognitest-app"
        PORT = "3000"
    }

    options {
        timestamps()
    }

    stages {

        stage('Docker Build') {
            steps {
                script {
                    echo "Building Docker image: ${IMAGE_NAME}:${BUILD_NUMBER}"
                    sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
                }
            }
        }

        stage('Stop Old Container') {
            steps {
                script {
                    sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    """
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    sh """
                    docker run -d -p ${PORT}:${PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}:${BUILD_NUMBER}
                    """
                }
            }
        }

        stage('Wait for App') {
            steps {
                script {
                    echo "Waiting for app to be ready on port ${PORT}..."
                    // Wait until the server responds
                    sh '''
                    retries=0
                    until curl -s http://localhost:${PORT}/health || [ $retries -eq 12 ]; do
                        echo "Waiting 5 seconds..."
                        sleep 5
                        retries=$((retries+1))
                    done
                    '''
                }
            }
        }

        stage('Trigger Test Execution') {
            steps {
                script {
                    echo "Triggering Cognitest execution..."
                    sh """
                    curl -X POST http://localhost:${PORT}/execute \
                    -H "Content-Type: application/json" \
                    -d '{"suite":"smoke","env":"qa","tags":["login"]}'
                    """
                }
            }
        }
    }

    post {
        always {
            script {
                echo "Printing container logs..."
                sh "docker logs ${CONTAINER_NAME} || true"
            }
        }
        cleanup {
            echo "Optional: remove old containers/images if needed"
        }
    }
}
