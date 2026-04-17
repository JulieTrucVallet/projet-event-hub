pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Install Dependencies') {
            parallel {
                stage('Frontend Deps') {
                    steps {
                        dir('client') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Backend Deps') {
                    steps {
                        dir('server') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }

        stage('Tests') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        dir('client') {
                            sh 'npm run test:ci'
                        }
                    }
                }
                stage('Backend Unit Tests') {
                    steps {
                        dir('server') {
                            sh 'npm test'
                        }
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('client') {
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                dir('server') {
                    sh 'docker compose build'
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                dir('server') {
                    sh '''
                    docker compose down || true
                    docker compose up -d --build
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline EventHub réussi !'
        }
        failure {
            echo 'Le pipeline EventHub a échoué.'
        }
        always {
            sh 'docker system prune -f || true'
        }
    }
}