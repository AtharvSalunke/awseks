variable "aws_region" {
  description = "AWS region where infrastructure will be created"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "availability_zones" {
  description = "Availability zones used by the VPC"
  type        = list(string)
}

variable "eks_cluster_name" {
  description = "EKS cluster name"
  type        = string
}

variable "eks_cluster_version" {
  description = "Kubernetes version for EKS"
  type        = string
}

variable "eks_node_instance_types" {
  description = "EC2 instance types for EKS managed node group"
  type        = list(string)
}

variable "eks_node_min_size" {
  description = "Minimum number of EKS nodes"
  type        = number
}

variable "eks_node_max_size" {
  description = "Maximum number of EKS nodes"
  type        = number
}

variable "eks_node_desired_size" {
  description = "Desired number of EKS nodes"
  type        = number
}

variable "ecr_repository_name" {
  description = "ECR repository name"
  type        = string
}