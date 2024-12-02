pipeline {
    parameters {
        string(name: 'ACTION', defaultValue: 'buildandpush', description: 'Action to perform: build or deploy')
    }

    environment {
        DOCKER_CREDENTIALS_ID = 'docker_hub'
        DOCKER_REGISTRY = 'pokilee10'
        KUBE_CONFIG_ID = 'minikube-jenkins-secret'
        KUBE_CLUSTER_NAME = 'minikube'
        KUBE_CONTEXT_NAME = 'minikube'
        KUBE_SERVER_URL = 'https://192.168.39.98:8443'
        SONAR_TOKEN = credentials('sonarqube')
        BUILD_TAG = "v${GIT_COMMIT[0..7]}"
        CLUSTER_NAME = 'group15-cluster'
    }
    agent any

    stages {
        stage('Clone Stage') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/Groupvslxl-3/Lab2_Jenkins.git'
            }
        }

        // stage('SonarQube Analysis') {
        //     steps {
        //         script {
        //             def scannerHome = tool 'sonar1'
        //             def services = ['admin', 'backend', 'frontend']
                    
        //             withSonarQubeEnv('sonar') {
        //                 services.each { service ->
        //                     dir(service) {
        //                         if (service in ['admin', 'frontend']) {
        //                             // Cấu hình cho React projects
        //                             sh """
        //                                 ${scannerHome}/bin/sonar-scanner \
        //                                 -Dsonar.projectKey=${service} \
        //                                 -Dsonar.projectName=${service} \
        //                                 -Dsonar.sources=src \
        //                                 -Dsonar.sourceEncoding=UTF-8 \
        //                                 -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
        //                                 -Dsonar.exclusions=**/node_modules/**,**/*.spec.ts,**/*.spec.js 
        //                             """
        //                         } else {
        //                             // Cấu hình cho Node.js backend
        //                             sh """
        //                                 ${scannerHome}/bin/sonar-scanner \
        //                                 -Dsonar.projectKey=${service} \
        //                                 -Dsonar.projectName=${service} \
        //                                 -Dsonar.sources=. \
        //                                 -Dsonar.sourceEncoding=UTF-8 \
        //                                 -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
        //                                 -Dsonar.exclusions=**/node_modules/**,**/*.spec.js,**/test/**,**/tests/** 
        //                             """
        //                         }
        //                     }
        //                 }
        //             }
                    
        //             // Kiểm tra Quality Gate
        //             timeout(time: 5, unit: 'MINUTES') {
        //                 services.each { service ->
        //                     def qg = waitForQualityGate projectKey: service
        //                     if (qg.status != 'OK') {
        //                         error "Quality gate failed for ${service}: ${qg.status}"
        //                     }
        //                     echo "Quality gate passed for ${service}"
        //                 }
        //             }
        //         }
        //     }
        // }

        stage('Build and Deploy Services') {
            parallel {
                stage('Frontend Service') {
                    steps {
                        script {
                            if (params.ACTION == 'buildandpush') {
                                buildAndPushImage('frontend')
                            }   else if (params.ACTION == 'deploy') {
                                withAWS(credentials: 'AWS_SECRET_KEY', region: 'us-east-1') {
                                    deployService('frontend')
                                }
                            } 
                        }
                    }
                }

                stage('Backend Service') {
                    steps {
                        script {
                            if (params.ACTION == 'buildandpush') {
                                buildAndPushImage('backend')
                            }   else if (params.ACTION == 'deploy') {
                                withAWS(credentials: 'AWS_SECRET_KEY', region: 'us-east-1') {
                                    deployService('backend')
                                }
                            } 
                        }
                    }
                }

                stage('Admin Service') {
                    steps {
                        script {
                            if (params.ACTION == 'buildandpush') {
                                buildAndPushImage('admin')
                            }   else if (params.ACTION == 'deploy') {
                                withAWS(credentials: 'AWS_SECRET_KEY', region: 'us-east-1') {
                                    deployService('admin')
                                }
                            } 
                        }
                    }
                }
            }
        }

        // stage('Verify Deployments') {
        //     steps {
        //         verifyDeployments()
        //     }
        // }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}

// Helper functions
def buildAndPushImage(String serviceName) {
        withDockerRegistry(credentialsId: DOCKER_CREDENTIALS_ID, url: 'https://index.docker.io/v1/') {
            dir(serviceName) {
                sh """
                    docker build -t ${DOCKER_REGISTRY}/jenkins_${serviceName}:${BUILD_TAG} .
                    docker push ${DOCKER_REGISTRY}/jenkins_${serviceName}:${BUILD_TAG}
                """
            }
        }
}

def deployService(String serviceName) {
        sh """
            aws eks update-kubeconfig --name ${CLUSTER_NAME} --region us-east-1
            kubectl apply -f ./k8s/deploy.yml
            kubectl apply -f ./k8s/ingress.yaml
            cd k8s/tag/${serviceName}
            kustomize edit set image ${serviceName}=${DOCKER_REGISTRY}/jenkins_${serviceName}:${BUILD_TAG}
            kubectl apply -k .
        """
}



def verifyDeployments() {
        sh '''
            kubectl get pods
            kubectl get services
            kubectl get deployments
        '''
}