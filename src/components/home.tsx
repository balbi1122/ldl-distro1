import React, { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Progress } from "./ui/progress";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Toggle } from "./ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import {
  AlertCircle,
  Bell,
  Check,
  ChevronRight,
  Code2,
  Layers,
  Mail,
  Palette,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

const categories = ["All", "Inputs", "Display", "Feedback", "Layout"];

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [progress, setProgress] = useState(60);
  const [sliderValue, setSliderValue] = useState([40]);
  const [switchOn, setSwitchOn] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight">showgirl</span>
              <span className="text-lg font-bold tracking-tight text-violet-600">stories</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden sm:flex gap-1">
              <Code2 className="h-3 w-3" /> 42 components
            </Badge>
            <Button size="sm" variant="outline">Docs</Button>
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
              <Star className="mr-2 h-4 w-4" /> Star
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <Badge className="mb-4 bg-violet-100 text-violet-700 hover:bg-violet-100">
          <Zap className="mr-1 h-3 w-3" /> Built with shadcn/ui + Tailwind CSS
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-4">
          A beautiful UI component{" "}
          <span className="text-violet-600">showcase</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-500 mb-8">
          Explore 42 production-ready components built with Radix UI primitives and styled with Tailwind CSS. Click, interact, and copy.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
            Browse Components <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            View on GitHub
          </Button>
        </div>
      </section>

      {/* Category Filter */}
      <section className="mx-auto max-w-7xl px-6 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              className={activeCategory === cat ? "bg-violet-600 hover:bg-violet-700 text-white" : ""}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </section>

      {/* Component Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Buttons */}
          {(activeCategory === "All" || activeCategory === "Inputs") && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-violet-600" />
                  <CardTitle className="text-base">Button</CardTitle>
                </div>
                <CardDescription>All variants and sizes</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button size="sm">Default</Button>
                <Button size="sm" variant="secondary">Secondary</Button>
                <Button size="sm" variant="outline">Outline</Button>
                <Button size="sm" variant="ghost">Ghost</Button>
                <Button size="sm" variant="destructive">Destructive</Button>
                <Button size="sm" variant="link">Link</Button>
              </CardContent>
            </Card>
          )}

          {/* Badge */}
          {(activeCategory === "All" || activeCategory === "Display") && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-violet-600" />
                  <CardTitle className="text-base">Badge</CardTitle>
                </div>
                <CardDescription>Status and label indicators</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Success</Badge>
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Warning</Badge>
              </CardContent>
            </Card>
          )}

          {/* Avatar */}
          {(activeCategory === "All" || activeCategory === "Display") && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-violet-600" />
                  <CardTitle className="text-base">Avatar</CardTitle>
                </div>
                <CardDescription>User profile images</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage src="https://github.com/radix-ui.png" />
                  <AvatarFallback>RU</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback className="bg-violet-100 text-violet-700">AB</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback className="bg-pink-100 text-pink-700">JD</AvatarFallback>
                </Avatar>
              </CardContent>
            </Card>
          )}

          {/* Input & Label */}
          {(activeCategory === "All" || activeCategory === "Inputs") && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-violet-600" />
                  <CardTitle className="text-base">Input</CardTitle>
                </div>
                <CardDescription>Text input fields</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input placeholder="you@example.com" type="email" />
                </div>
                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input placeholder="••••••••" type="password" />
                </div>
                <Input placeholder="Disabled input" disabled />
              </CardContent>
            </Card>
          )}

          {/* Select */}
          {(activeCategory === "All" || activeCategory === "Inputs") && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-violet-600" />
                  <CardTitle className="text-base">Select</CardTitle>
                </div>
                <CardDescription>Dropdown selection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="mango">Mango</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Disabled" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="x">x</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Textarea */}
          {(activeCategory === "All" || activeCategory === "Inputs") && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-violet-600" />
                  <CardTitle className="text-base">Textarea</CardTitle>
                </div>
                <CardDescription>Multi-line text input</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label>Your message</Label>
                  <Textarea placeholder="Type your message here..." rows={3} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Checkbox & Switch */}
          {(activeCategory === "All" || activeCategory === "Inputs") && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-violet-600" />
                  <CardTitle className="text-base">Checkbox & Switch</CardTitle>
                </div>
                <CardDescription>Toggle controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Checkbox id="terms" defaultChecked />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="newsletter" />
                  <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label>Notifications</Label>
                  <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Dark mode</Label>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress & Slider */}
          {(activeCategory === "All" || activeCategory === "Feedback") && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-violet-600" />
                  <CardTitle className="text-base">Progress & Slider</CardTitle>
                </div>
                <CardDescription>Range and progress indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setProgress(Math.max(0, progress - 10))}>-10</Button>
                    <Button size="sm" variant="outline" onClick={() => setProgress(Math.min(100, progress + 10))}>+10</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Slider</span>
                    <span>{sliderValue[0]}</span>
                  </div>
                  <Slider
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    max={100}
                    step={1}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alert */}
          {(activeCategory === "All" || activeCategory === "Feedback") && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-violet-600" />
                  <CardTitle className="text-base">Alert</CardTitle>
                </div>
                <CardDescription>Inline feedback messages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert>
                  <Bell className="h-4 w-4" />
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Tabs */}
          {(activeCategory === "All" || activeCategory === "Layout") && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-violet-600" />
                  <CardTitle className="text-base">Tabs</CardTitle>
                </div>
                <CardDescription>Tabbed content sections</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="account">
                  <TabsList className="w-full">
                    <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
                    <TabsTrigger value="password" className="flex-1">Password</TabsTrigger>
                    <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account" className="mt-3 text-sm text-slate-500">
                    Manage your account details and preferences here.
                  </TabsContent>
                  <TabsContent value="password" className="mt-3 text-sm text-slate-500">
                    Change your password and security settings.
                  </TabsContent>
                  <TabsContent value="settings" className="mt-3 text-sm text-slate-500">
                    Configure application-wide settings and options.
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Accordion */}
          {(activeCategory === "All" || activeCategory === "Layout") && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-violet-600" />
                  <CardTitle className="text-base">Accordion</CardTitle>
                </div>
                <CardDescription>Collapsible content panels</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>Yes. Adheres to the WAI-ARIA design pattern.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Is it styled?</AccordionTrigger>
                    <AccordionContent>Yes. Comes with default styles that match the other components.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is it animated?</AccordionTrigger>
                    <AccordionContent>Yes. It's animated by default, but you can disable it if you prefer.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          )}

          {/* Card */}
          {(activeCategory === "All" || activeCategory === "Display") && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-violet-600" />
                  <CardTitle className="text-base">Card</CardTitle>
                </div>
                <CardDescription>Content container with sections</CardDescription>
              </CardHeader>
              <CardContent>
                <Card className="border-violet-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Mail className="h-4 w-4 text-violet-600" />
                      Notification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-500">
                    You have a new message from the team.
                  </CardContent>
                  <CardFooter className="gap-2 pt-0">
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
                      <Check className="mr-1 h-3 w-3" /> Mark read
                    </Button>
                    <Button size="sm" variant="outline">Dismiss</Button>
                  </CardFooter>
                </Card>
              </CardContent>
            </Card>
          )}

          {/* Toggle & Tooltip */}
          {(activeCategory === "All" || activeCategory === "Inputs") && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-violet-600" />
                  <CardTitle className="text-base">Toggle & Tooltip</CardTitle>
                </div>
                <CardDescription>Interactive controls with hints</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Toggle variant="outline" aria-label="Bold">
                    <span className="font-bold text-sm">B</span>
                  </Toggle>
                  <Toggle variant="outline" aria-label="Italic">
                    <span className="italic text-sm">I</span>
                  </Toggle>
                  <Toggle variant="outline" aria-label="Underline">
                    <span className="underline text-sm">U</span>
                  </Toggle>
                </div>
                <Separator />
                <TooltipProvider>
                  <div className="flex gap-3 flex-wrap">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm">Hover me</Button>
                      </TooltipTrigger>
                      <TooltipContent>This is a tooltip!</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
                          <Palette className="mr-2 h-3 w-3" /> Styled
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>A styled button with icon</TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </CardContent>
            </Card>
          )}

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">showgirl<span className="text-violet-600">stories</span></span>
          </div>
          <p className="text-sm text-slate-400">
            Built with shadcn/ui · Radix UI · Tailwind CSS
          </p>
          <div className="flex gap-4 text-sm text-slate-400">
            <a href="#" className="hover:text-slate-700 transition-colors">GitHub</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Docs</a>
            <a href="#" className="hover:text-slate-700 transition-colors">License</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
