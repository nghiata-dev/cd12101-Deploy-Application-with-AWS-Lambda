import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
const s3Client = new S3Client()

const bucketName = process.env.TODOS_S3_BUCKET
const signedUrlExpireSeconds = 60 * 5

export const getPutSignedUrl = (key) => {
  const uploadUrl = s3Client.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: key,
    Expires: signedUrlExpireSeconds
  })
  return uploadUrl
}

export const generateImageUrl = async (imageId) => {
  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: imageId
  })
  const presignedUrl = await getSignedUrl(s3Client, command)
  return { presignedUrl, imageUrl }
}
