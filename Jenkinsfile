pipeline {
  agent any
  options {
    timestamps()
  }
  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }
    stage('Validate') {
      steps {
        sh 'npm run lint'
        sh 'npm run typecheck'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    stage('Sample Execution') {
      steps {
        sh 'npm run test'
      }
    }
    stage('Docker Build') {
      steps {
        sh 'docker build -t cognitest-engine:${BUILD_NUMBER} .'
      }
    }
  }
}
