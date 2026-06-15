"use client";

import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

function getToolCallLabel(tool: ToolInvocation): string {
  const args = tool.args as { command?: string; path?: string };
  const basename = args.path ? args.path.split("/").pop() || args.path : undefined;

  if (tool.toolName === "str_replace_editor" && args.command && basename) {
    switch (args.command) {
      case "create":
        return `Creating ${basename}`;
      case "str_replace":
      case "insert":
      case "undo_edit":
        return `Editing ${basename}`;
      case "view":
        return `Viewing ${basename}`;
    }
  }

  if (tool.toolName === "file_manager" && args.command && basename) {
    switch (args.command) {
      case "rename":
        return `Renaming ${basename}`;
      case "delete":
        return `Deleting ${basename}`;
    }
  }

  return tool.toolName;
}

interface ToolCallBadgeProps {
  tool: ToolInvocation;
}

export function ToolCallBadge({ tool }: ToolCallBadgeProps) {
  const label = getToolCallLabel(tool);
  const isDone = tool.state === "result" && tool.result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-neutral-700">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{label}</span>
        </>
      )}
    </div>
  );
}

export { getToolCallLabel };
