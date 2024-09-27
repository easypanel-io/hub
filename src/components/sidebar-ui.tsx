"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowDown,
  ArrowUp,
  BarChart,
  Bell,
  Calendar,
  Cloud,
  Code,
  Cpu,
  Database,
  Download,
  Edit2,
  File,
  Folder,
  Globe,
  Home,
  Layers,
  Mail,
  MessageSquare,
  Monitor,
  Moon,
  Network,
  Plus,
  Search,
  Server,
  Settings,
  Shield,
  Sun,
  Terminal,
  Upload,
  Users,
  Workflow,
} from "lucide-react";
import { useTheme } from "next-themes";
import { createElement, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ServerData {
  label: string;
  url: string;
  icon: keyof typeof predefinedLucideIcons | null;
  color: string;
}

const predefinedLucideIcons = {
  Server,
  Globe,
  Database,
  Cloud,
  Code,
  Terminal,
  Settings,
  Shield,
  Cpu,
  Layers,
  Network,
  Workflow,
  Home,
  Folder,
  File,
  Users,
  Mail,
  MessageSquare,
  Bell,
  Calendar,
  Search,
  BarChart,
};

const predefinedColors = [
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#10b981", // Green
  "#f59e0b", // Yellow
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#f97316", // Orange
  "#64748b", // Slate
];

const defaultColor = predefinedColors[0];

export function SidebarUi() {
  const [servers, setServers] = useState<ServerData[]>(() => {
    const storedServers = localStorage.getItem("sidebarServers");
    return storedServers ? JSON.parse(storedServers) : [];
  });

  const [selectedServerIndex, setSelectedServerIndex] = useState<number | null>(
    null
  );
  const [isAddingServer, setIsAddingServer] = useState(false);
  const [editingServerIndex, setEditingServerIndex] = useState<number | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState<ServerData>({
    label: "",
    url: "",
    icon: null,
    color: defaultColor,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const url = searchParams.get("url");
    const label = searchParams.get("label");

    if (url) {
      setIsAddingServer(true);
      setFormData({
        label: label || "",
        url: url,
        icon: null,
        color: defaultColor,
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarServers", JSON.stringify(servers));
  }, [servers]);

  const handleAddServer = (newServer: ServerData) => {
    setServers([...servers, newServer]);
    setIsAddingServer(false);
    toast.success("Server Added", {
      description: `${newServer.label} has been added successfully.`,
    });
  };

  const handleUpdateServer = (updatedServer: ServerData, index: number) => {
    setServers(
      servers.map((server, i) => (i === index ? updatedServer : server))
    );
    setEditingServerIndex(null);
    setSelectedServerIndex(index);
    toast.success("Server Updated", {
      description: `${updatedServer.label} has been updated successfully.`,
    });
  };

  const handleDeleteServer = (index: number) => {
    const deletedServer = servers[index];
    setServers(servers.filter((_, i) => i !== index));
    setEditingServerIndex(null);
    setSelectedServerIndex(null);
    toast.success("Server Removed", {
      description: `${deletedServer.label} has been removed.`,
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(servers);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "easypanel-hub.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedServers = JSON.parse(e.target?.result as string);
          setServers(importedServers);
          toast.success("Import Successful", {
            description: "Servers imported successfully",
          });
        } catch {
          toast.error("Import Failed", {
            description: "Error importing servers",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedServers = JSON.parse(e.target?.result as string);
          setServers(importedServers);
          toast.success("Import Successful", {
            description: "Servers imported successfully",
          });
        } catch {
          toast.error("Import Failed", {
            description: "Error importing servers",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleMoveServer = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < servers.length) {
      const newServers = [...servers];
      [newServers[index], newServers[newIndex]] = [
        newServers[newIndex],
        newServers[index],
      ];
      setServers(newServers);
      setSelectedServerIndex(newIndex);
      setEditingServerIndex(newIndex);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className="flex h-screen bg-background"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="w-16 bg-card shadow-md flex flex-col items-center py-3 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-10 h-10"
                onClick={() => setIsAddingServer(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Add new server</p>
            </TooltipContent>
          </Tooltip>

          <Dialog open={isAddingServer} onOpenChange={setIsAddingServer}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Server</DialogTitle>
              </DialogHeader>
              <ServerForm onSubmit={handleAddServer} initialData={formData} />
            </DialogContent>
          </Dialog>

          <div className="flex-1 overflow-y-auto w-full py-2 px-3">
            {servers.map((server, index) => (
              <a
                href={server.url}
                target="_blank"
                onClick={(e) => {
                  if (!e.metaKey) {
                    e.preventDefault();
                  }
                }}
              >
                <div
                  key={server.label}
                  className="relative flex justify-center mb-2"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          selectedServerIndex === index ? "default" : "outline"
                        }
                        size="icon"
                        className={`w-10 h-10 ${
                          selectedServerIndex === index ? "border-2" : ""
                        }`}
                        onClick={(e) => {
                          if (!e.metaKey) {
                            setSelectedServerIndex(index);
                          }
                        }}
                        style={{
                          backgroundColor:
                            selectedServerIndex === index
                              ? server.color
                              : "transparent",
                          color:
                            selectedServerIndex === index
                              ? "white"
                              : server.color,
                          borderColor:
                            selectedServerIndex === index
                              ? server.color
                              : undefined,
                        }}
                      >
                        {server.icon === null ? (
                          <span className="text-lg font-bold">
                            {server.label.slice(0, 2).toUpperCase()}
                          </span>
                        ) : (
                          predefinedLucideIcons[server.icon] &&
                          createElement(predefinedLucideIcons[server.icon], {
                            className: "w-5 h-5",
                          })
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{server.label}</p>
                    </TooltipContent>
                  </Tooltip>
                  {selectedServerIndex === index && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full"
                      onClick={() => setEditingServerIndex(index)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </a>
            ))}
          </div>

          <div className="mt-auto space-y-2 w-full px-3">
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-10 h-10 mx-auto relative"
                    >
                      {theme === "light" && (
                        <Sun className="h-[1.2rem] w-[1.2rem]" />
                      )}
                      {theme === "dark" && (
                        <Moon className="h-[1.2rem] w-[1.2rem]" />
                      )}
                      {theme === "system" && (
                        <>
                          {window.matchMedia("(prefers-color-scheme: dark)")
                            .matches ? (
                            <Moon className="h-[1.2rem] w-[1.2rem]" />
                          ) : (
                            <Sun className="h-[1.2rem] w-[1.2rem]" />
                          )}
                        </>
                      )}
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Toggle theme</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" side="right">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 mx-auto"
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Export servers</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 mx-auto"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Import servers</TooltipContent>
            </Tooltip>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              style={{ display: "none" }}
              accept=".json"
            />
          </div>
        </div>
        <div className="flex-1 relative">
          {selectedServerIndex !== null ? (
            <iframe
              src={servers[selectedServerIndex].url}
              className="absolute inset-0 w-full h-full border-none"
              title="Content"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Server className="w-16 h-16 mb-4" strokeWidth={1.5} />
              <p className="text-xl font-semibold">Welcome to Easypanel Hub</p>
              {servers.length > 0 ? (
                <p className="mt-2">Select a server from the sidebar</p>
              ) : (
                <div className="mt-2 flex flex-col items-center">
                  <div className="mt-2 flex gap-2 items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddingServer(true)}
                    >
                      Add your first server
                    </Button>
                    <span>or</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleAddServer({
                          label: "Demo",
                          url: "https://demo.easypanel.io",
                          icon: "Globe",
                          color: "#059669",
                        });
                        setSelectedServerIndex(0);
                      }}
                    >
                      Add demo server
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <Dialog
          open={editingServerIndex !== null}
          onOpenChange={() => setEditingServerIndex(null)}
        >
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Server</DialogTitle>
            </DialogHeader>
            {editingServerIndex !== null && (
              <ServerForm
                initialData={servers[editingServerIndex]}
                onSubmit={(updatedServer) =>
                  handleUpdateServer(updatedServer, editingServerIndex)
                }
                onDelete={() => handleDeleteServer(editingServerIndex)}
                onMoveUp={
                  editingServerIndex > 0
                    ? () => handleMoveServer(editingServerIndex, "up")
                    : undefined
                }
                onMoveDown={
                  editingServerIndex < servers.length - 1
                    ? () => handleMoveServer(editingServerIndex, "down")
                    : undefined
                }
              />
            )}
          </DialogContent>
        </Dialog>
        <Toaster position="bottom-center" />
      </div>
    </TooltipProvider>
  );
}

interface ServerFormProps {
  initialData?: ServerData;
  onSubmit: (data: ServerData) => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

function ServerForm({
  initialData,
  onSubmit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: ServerFormProps) {
  const [formData, setFormData] = useState<ServerData>(
    initialData || {
      label: "",
      url: "",
      icon: null,
      color: defaultColor,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIconSelect = (
    icon: keyof typeof predefinedLucideIcons | null
  ) => {
    setFormData({ ...formData, icon });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url.startsWith("https://")) {
      toast.error("Invalid URL", {
        description: "URL must start with https://",
      });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          name="label"
          value={formData.label}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          required
          placeholder="https://"
        />
      </div>
      <div>
        <Label>Icon</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          <Button
            key="none"
            type="button"
            variant={formData.icon === null ? "default" : "outline"}
            size="sm"
            onClick={() => handleIconSelect(null)}
            className="w-10 h-10 p-2"
          >
            <span className="text-lg font-bold">AA</span>
          </Button>
          {Object.entries(predefinedLucideIcons).map(([name, Icon]) => (
            <Button
              key={name}
              type="button"
              variant={formData.icon === name ? "default" : "outline"}
              size="sm"
              onClick={() =>
                handleIconSelect(name as keyof typeof predefinedLucideIcons)
              }
              className="w-10 h-10 p-2"
            >
              <Icon className="w-full h-full" />
            </Button>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="color">Color</Label>
        <div className="relative mt-2">
          <Input
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="Hex color code"
            className="pr-12"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <Input
              id="color"
              name="color"
              type="color"
              value={formData.color}
              onChange={handleChange}
              className="w-8 h-8 p-0 border-none"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {predefinedColors.map((color) => (
            <Button
              key={color}
              type="button"
              variant={formData.color === color ? "default" : "outline"}
              size="sm"
              onClick={() => setFormData({ ...formData, color })}
              className="w-8 h-8 p-0"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Button type="submit">{initialData ? "Update" : "Add"} Server</Button>
        {initialData && (
          <div className="flex space-x-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onMoveUp}
                    disabled={!onMoveUp}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {onMoveUp ? "Move server up" : "Cannot move up"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onMoveDown}
                    disabled={!onMoveDown}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {onMoveDown ? "Move server down" : "Cannot move down"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {onDelete && (
              <Button type="button" variant="destructive" onClick={onDelete}>
                Remove Server
              </Button>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
