import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import LoadingButton from "./ui/loading-button";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
interface AddNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;

}

export default function AddNoteDialog({
  open,
  setOpen,

}: AddNoteDialogProps) {
    const router = useRouter();
  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title:  "",
      content: "",
    },
  });

  async function onSubmit(input: CreateNoteSchema) {
      try {
          const response = await fetch("/api/notes", {
              method: "POST",
              body:JSON.stringify(input)
          })
          if (response.ok) throw Error("status code :" + response.status)
          form.reset();
          router.refresh();
          setOpen(false);
      } catch (error) {
          console.log(error);
          alert("Please try again")
   }
  }



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add note</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {/* {noteToEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteNote}
                  type="button"
                >
                  Delete note
                </LoadingButton>
              )} */}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                // disabled={deleteInProgress}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}