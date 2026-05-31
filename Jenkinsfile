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

                sh '''
                    docker build \
                    -t ${ECR_REPOSITORY}:${IMAGE_TAG} .
                '''
            }
        }

        stage('Login To ECR') {

            steps {

                sh '''
                    aws ecr get-login-password \
                    --region ${AWS_REGION} | \
                    docker login \
                    --username AWS \
                    --password-stdin \
                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                '''
            }
        }

        stage('Tag Docker Image') {

            steps {

                sh '''
                    docker tag \
                    ${ECR_REPOSITORY}:${IMAGE_TAG} \
                    ${ECR_URI}:${IMAGE_TAG}
                '''
            }
        }

        stage('Push Docker Image') {

            steps {

                sh '''
                    docker push \
                    ${ECR_URI}:${IMAGE_TAG}
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

            sh '''
                docker image prune -f || true
            '''
        }
    }
}