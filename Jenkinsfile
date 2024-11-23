pipeline {
    agent any
    stages {
        stage('Clone Stage') {
            steps {
                git branch: 'main', url: 'https://github.com/Groupvslxl-3/Lab2_Jenkins.git'
            }
        }
        stage('Build and Push Images Stage') {
            steps {
                withDockerRegistry(credentialsId: 'docker_hub', url: 'https://index.docker.io/v1/') {
                    // Build và push cho frontend
                    dir('frontend') {
                        sh 'docker build -t pokilee10/jenkins_frontend:latest .'
                        sh 'docker push pokilee10/jenkins_frontend:latest'
                    }
                    // Build và push cho backend
                    dir('backend') {
                        sh 'docker build -t pokilee10/jenkins_backend:latest .'
                        sh 'docker push pokilee10/jenkins_backend:latest'
                    }
                    // Build và push cho admin
                    dir('admin') {
                        sh 'docker build -t pokilee10/jenkins_admin:latest .'
                        sh 'docker push pokilee10/jenkins_admin:latest'
                    }
                }
            }
        }
    }
}
