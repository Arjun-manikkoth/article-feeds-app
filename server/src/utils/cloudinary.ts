import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
export default cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImages = async (images: Express.Multer.File[]) => {
    try {
        const uploadedUrls = await Promise.all(
            images.map(async (image, index) => {
                const customName = `article_feeds_${Date.now()}_${index}`;

                const uploadedImage = await cloudinary.uploader.upload(
                    `data:image/png;base64,${image.buffer.toString("base64")}`,
                    {
                        public_id: customName,
                        overwrite: true,
                        resource_type: "image",
                        folder: "article-feeds",
                    }
                );

                return uploadedImage.secure_url;
            })
        );

        return uploadedUrls;
    } catch (error: any) {
        console.error("Error uploading images:", error.message);
        throw new Error("Error in uploading images");
    }
};

export { uploadImages };
