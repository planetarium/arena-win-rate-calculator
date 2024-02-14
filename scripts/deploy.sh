#!/bin/bash

# 빌드 과정
npm run build

# S3 버킷에 빌드된 파일 업로드
aws s3 cp ./dist s3://ares.nine-chronicles.dev --recursive

