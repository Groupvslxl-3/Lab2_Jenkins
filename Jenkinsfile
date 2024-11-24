pipeline {
    agent any

    stages {
        stage('Clone Stage') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/Groupvslxl-3/Lab2_Jenkins.git'
            }
        }

        stage('Build and Push Images Stage') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        withDockerRegistry(
                            credentialsId: 'docker_hub', 
                            url: 'https://index.docker.io/v1/'
                        ) { 
                            dir('frontend') {
                                sh '''
                                    docker build -t pokilee10/jenkins_frontend:latest .
                                    docker push pokilee10/jenkins_frontend:latest
                                '''
                            }
                        }
                    }
                }

                stage('Build Backend') {
                    steps {
                        withDockerRegistry(
                            credentialsId: 'docker_hub', 
                            url: 'https://index.docker.io/v1/'
                        ) {
                            dir('backend') {
                                sh '''
                                    docker build -t pokilee10/jenkins_backend:latest .
                                    docker push pokilee10/jenkins_backend:latest
                                '''
                            }
                        }
                    }
                }

                stage('Build Admin') {
                    steps {
                        withDockerRegistry(
                            credentialsId: 'docker_hub', 
                            url: 'https://index.docker.io/v1/'
                        ) {
                            dir('admin') {
                                sh '''
                                    docker build -t pokilee10/jenkins_admin:latest .
                                    docker push pokilee10/jenkins_admin:latest
                                '''
                            }
                        }
                    }
                }
            }
        }

        stage('Test') {
            steps {
                withKubeConfig(
                    caCertificate: '', 
                    clusterName: 'minikube', 
                    contextName: 'minikube', 
                    credentialsId: '', 
                    namespace: '', 
                    restrictKubeConfigAccess: false, 
                    serverUrl: 'https://192.168.39.98:8443'
                ) {
                    sh '''
                        kubectl get ns
                        helm ls
                    '''
                }
            }
        }
    }
}