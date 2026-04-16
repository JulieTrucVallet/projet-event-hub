pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/JulieTrucVallet/projet-event-hub.git'
            }
        }

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
                    sh 'npm run test:unit'
                }
            }
        }
    }
}