// [build] library: 'shadcn'
import { Button } from "../components/ui/button";
import { Toaster } from "../components/ui/toaster";
import { useToast } from "../components/ui/use-toast";

const meta = {
  title: "ui/Toast",
  tags: ["autodocs"],
  argTypes: {},
};
export default meta;

function BasicToast() {
  const { toast } = useToast();

  return (
    <div>
      <Toaster />
      <Button
        onClick={() =>
          toast({
            description: "Your message has been sent.",
          })
        }
      >
        Show Toast
      </Button>
    </div>
  );
}

function ToastWithTitle() {
  const { toast } = useToast();

  return (
    <div>
      <Toaster />
      <Button
        onClick={() =>
          toast({
            title: "Scheduled: Catch up",
            description: "Friday, February 10, 2023 at 5:57 PM",
          })
        }
      >
        Show Toast with Title
      </Button>
    </div>
  );
}

function DestructiveToast() {
  const { toast } = useToast();

  return (
    <div>
      <Toaster />
      <Button
        variant="destructive"
        onClick={() =>
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          })
        }
      >
        Show Destructive Toast
      </Button>
    </div>
  );
}

function ToastWithAction() {
  const { toast } = useToast();

  return (
    <div>
      <Toaster />
      <Button
        onClick={() =>
          toast({
            title: "Undo action",
            description: "Your file has been deleted.",
            action: (
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log("Undo clicked")}
              >
                Undo
              </Button>
            ) as any,
          })
        }
      >
        Show Toast with Action
      </Button>
    </div>
  );
}

export const Base = {
  render: () => <BasicToast />,
  args: {},
};

export const WithTitle = {
  render: () => <ToastWithTitle />,
  args: {},
};

export const Destructive = {
  render: () => <DestructiveToast />,
  args: {},
};

export const WithAction = {
  render: () => <ToastWithAction />,
  args: {},
};
