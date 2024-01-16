#!/bin/bash

# 빌드 과정
npm run build

# S3 버킷에 빌드된 파일 업로드
aws s3 sync ./dist s3://arena-win-rate-calculator --delete

# CloudFront 캐시 초기화
aws cloudfront create-invalidation --distribution-id E2HJDCUZVN00K5 --paths "/*"
