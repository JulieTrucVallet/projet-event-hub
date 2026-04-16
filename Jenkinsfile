pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    stages {
        stage('Install frontend') {
            steps {
                dir('client') {
                    sh 'npm ci'
                }
            }
        }

        stage('Test frontend') {
            steps {
                dir('client') {
                    sh 'npm run test:ci'
                }
            }
        }

        stage('Install backend') {
            steps {
                dir('server') {
                    sh 'npm ci'
                }
            }
        }

        stage('Test backend') {
            steps {
                dir('server') {
                    sh 'npm test'
                }
            }
        }
    }
}