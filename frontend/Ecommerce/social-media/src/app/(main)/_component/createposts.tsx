"use client";

import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePost } from "@/hooks/mutation/posts";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { any } from "zod";

type PostFormData = {
  title: string;
  content: string;
  image?: File | null;
};

export default function CreatePostDialog() {
  const [preview, setPreview] = useState<string | null>(null);
  const [rejected, setRejected] = useState<string | null>(null);
  const { userId } = useAuth();
  const { mutate, isPending, error } = useCreatePost();

  const { register, handleSubmit, reset, setValue } = useForm<PostFormData>({
    defaultValues: { title: "", content: "", image: null },
  });


  const onDrop = useCallback(
    (
      acceptedFiles: File[]
    ) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setPreview(URL.createObjectURL(file));
        setValue("image", file);
      }

} ,[setValue]
  );
  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  const removeFile = (name: string) => {
    setPreview(null);
    setValue("image", null);
  };

  const removeRejected = (name: string) => {
    setRejected(null);
    setValue("image", null);
  };

  const onSubmit = async (data: PostFormData) => {
    let imageUrl = null;

    if (data.image) {
      const formData = new FormData();
      formData.append("file", data.image);
      formData.append("upload_preset", "tpm3nzga");

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
      const cloudinaryURL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
      const res = await fetch(cloudinaryURL, {
        method: "POST",
        body: formData,
      });
      const uploadData = await res.json(); //
      imageUrl = uploadData.secure_url;

    }
    const formData = {
      title: data.title,
      content: data.content,
      image: imageUrl,
      authorId: userId,
    };

    mutate(formData, {
      onSuccess: () => {
        reset();
        setPreview(null);
      }, onError: (err) => {
        console.error(" Mutation error:", err);
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full text-left">
          What’s on your mind?
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input placeholder="Title" {...register("title", { required: true })} />
          <Textarea placeholder="What's happening?" {...register("content", { required: true })} />

          {/* 🖼️ Dropzone for image */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed p-4 rounded-md text-center cursor-pointer ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="relative w-fit mx-auto">
                <Image src={preview} alt="Preview" width={100} height={100} className="rounded-md" />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-0 right-0"
                  onClick={() => removeFile("image")}
                >
                  X
                </Button>
              </div>
            ) : (
              <p>Drag & drop an image here, or click to select one</p>
            )}
          </div>

          {rejected && <p className="text-red-500 text-sm">{rejected}</p>}
          {error && <p className="text-red-500 text-sm">{(error as Error).message}</p>}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Posting..." : "Post"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
