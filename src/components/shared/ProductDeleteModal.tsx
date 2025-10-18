import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteProductMutation } from "@/services/api";
import { Product } from "@/types/products";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { DialogFooter, DialogHeader } from "../ui/dialog";

export default function ProductDeleteModal({
  deleteDialogOpen,
  dialogOpenChange,
  product,
}: {
  deleteDialogOpen: boolean;
  dialogOpenChange: (open: boolean) => void;
  product: Product;
}) {
  const { push } = useRouter();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const confirmDelete = async () => {
    if (!product) return;

    try {
      await deleteProduct(product.id).unwrap();
      dialogOpenChange(false);
      toast.success("Product deleted successfully");
      push("/products");
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };
  return (
    <Dialog open={deleteDialogOpen} onOpenChange={dialogOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{product?.name}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => dialogOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
