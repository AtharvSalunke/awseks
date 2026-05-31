pipeline {

    agent any

    environment {

        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = '456387077267'
        ECR_REPOSITORY = 'user-service'

        IMAGE_TAG = "${BUILD_NUMBER}"

        ECR_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"
    }

    stages {

        stage('Checkout') {

            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {

            steps {

                bat '''
                docker build -t %ECR_REPOSITORY%:%IMAGE_TAG% .
                '''
            }
        }

        stage('Login To ECR') {

            steps {

                bat '''
                aws ecr get-login-password --region %AWS_REGION% > password.txt
                type password.txt | docker login --username AWS --password-stdin %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com
                del password.txt
                '''
            }
        }

        stage('Tag Docker Image') {

            steps {

                bat '''
                docker tag %ECR_REPOSITORY%:%IMAGE_TAG% %ECR_URI%:%IMAGE_TAG%
                '''
            }
        }

        stage('Push Docker Image') {

            steps {

                bat '''
                docker push %ECR_URI%:%IMAGE_TAG%
                '''
            }
        }

    }

    post {

        success {

            echo "Image successfully pushed to ECR"

            echo "${ECR_URI}:${IMAGE_TAG}"
        }

        failure {

            echo "Pipeline failed"
        }

        always {

            bat '''
            docker image prune -f
            '''
        }
    }
}