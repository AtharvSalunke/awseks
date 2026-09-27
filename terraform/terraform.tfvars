aws_region  = "ap-south-1"
project_name = "user-service"
environment  = "dev"

vpc_cidr = "10.0.0.0/16"

availability_zones = [
  "ap-south-1a",
  "ap-south-1b"
]

eks_cluster_name    = "demo-eks"
eks_cluster_version = "1.33"

eks_node_instance_types = [
  "t3.small"
]

eks_node_min_size     = 1
eks_node_max_size     = 1
eks_node_desired_size = 1

ecr_repository_name = "user-service"