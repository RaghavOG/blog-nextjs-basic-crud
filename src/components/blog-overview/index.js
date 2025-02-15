"use client";
import { useEffect, useState } from "react";
import AddNewBlog from "../add-new-blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

const initialBlogFormData = {
  title: "",
  description: "",
};

function BlogOverview({ blogList }) {
  const [openBlogDialog, setOpenBlogDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blogFormData, setBlogFormData] = useState(initialBlogFormData);
  const [currentEditedBlogID, setCurrentEditedBlogID] = useState(null);

  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  async function handleSaveBlogData() {
    try {
      setLoading(true);
      const apiResponse =
        currentEditedBlogID !== null
          ? await fetch(`/api/update-blog?id=${currentEditedBlogID}`, {
              method: "PUT",
              body: JSON.stringify(blogFormData),
            })
          : await fetch("/api/add-blog", {
              method: "POST",
              body: JSON.stringify(blogFormData),
            });
      const result = await apiResponse.json();
      if (result?.success) {
        setBlogFormData(initialBlogFormData);
        setOpenBlogDialog(false);
        setLoading(false);
        setCurrentEditedBlogID(null);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setBlogFormData(initialBlogFormData);
    }
  }

  async function handleDeleteBlogByID(getCurrentID) {
    try {
      const apiResponse = await fetch(`/api/delete-blog?id=${getCurrentID}`, {
        method: "DELETE",
      });
      const result = await apiResponse.json();

      if (result?.success) router.refresh();
    } catch (e) {
      console.error(e);
    }
  }

  function handleEdit(getCurrentBlog) {
    setCurrentEditedBlogID(getCurrentBlog?._id);
    setBlogFormData({
      title: getCurrentBlog?.title,
      description: getCurrentBlog?.description,
    });
    setOpenBlogDialog(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Blog Overview</h1>
        <Button
          onClick={() => setOpenBlogDialog(true)}
          className="mb-8 bg-white text-purple-600 hover:bg-purple-100 transition-colors duration-300"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Blog
        </Button>
        <AddNewBlog
          openBlogDialog={openBlogDialog}
          setOpenBlogDialog={setOpenBlogDialog}
          loading={loading}
          setLoading={setLoading}
          blogFormData={blogFormData}
          setBlogFormData={setBlogFormData}
          handleSaveBlogData={handleSaveBlogData}
          currentEditedBlogID={currentEditedBlogID}
          setCurrentEditedBlogID={setCurrentEditedBlogID}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogList && blogList.length > 0 ? (
            blogList.map((blogItem) => (
              <Card key={blogItem._id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <CardTitle className="text-2xl font-bold mb-4">{blogItem?.title}</CardTitle>
                  <CardDescription className="text-gray-600 mb-6">{blogItem?.description}</CardDescription>
                  <div className="flex justify-end space-x-4">
                    <Button
                      onClick={() => handleEdit(blogItem)}
                      variant="outline"
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteBlogByID(blogItem._id)}
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center">
              <Label className="text-3xl font-extrabold text-white">
                No Blogs found! Please add one
              </Label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogOverview;
