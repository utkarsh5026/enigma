/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { ChevronRight, Eye, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getMinimalNodeStyle, getNodeIcon } from "../utils/node-info";
import { motion } from "framer-motion";
import {
  getSimpleProperties,
  getComplexProperties,
  hasChildren,
  getNodeSummary,
} from "../utils/node-utils";

interface AstNodeProps {
  node: any;
  depth: number;
  path: string;
  isLast?: boolean;
  onNodeClick?: (node: any) => void;
  isHighlighted?: boolean;
}

const AstNode: React.FC<AstNodeProps> = ({
  node,
  depth,
  path,
  isLast = false,
  onNodeClick,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!node) return null;

  const { name: nodeType, description } = node.whatIam();
  const style = getMinimalNodeStyle(nodeType);
  const icon = getNodeIcon(nodeType);

  const position = node.nodeRange();

  const hasExpandableChildren = hasChildren(node);

  // Handle node click for highlighting
  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNodeClick && position) {
      onNodeClick(node);
    }
  };

  const simpleProps = getSimpleProperties(node);
  const complexProps = getComplexProperties(node);
  return (
    <div className="relative">
      {/* Connection lines */}
      {depth > 0 && (
        <>
          <div
            className="absolute left-0 -top-2 border-l border-tokyo-comment/50"
            style={{
              height: isLast ? "14px" : "calc(100% + 16px)",
              left: `${(depth - 1) * 24 + 12}px`,
            }}
          />
          <div
            className="absolute top-4 border-t border-tokyo-comment/50"
            style={{
              left: `${(depth - 1) * 24 + 12}px`,
              width: "20px",
            }}
          />
        </>
      )}

      <div
        className={`relative ${depth > 0 ? "ml-6" : ""}`}
        style={{ marginLeft: depth > 0 ? `${depth * 24}px` : 0 }}
      >
        <motion.div
          className={`
            relative rounded-md border backdrop-blur-sm transition-all duration-200
          `}
        >
          {/* Main content */}
          <div
            className={`
              px-3 py-2 flex items-center justify-between rounded-md
              ${hasExpandableChildren ? "hover:bg-tokyo-bg-highlight/30" : ""}
            `}
            onClick={onNodeClick && position ? handleNodeClick : undefined}
          >
            <div className="flex items-center gap-2">
              {/* Expand/collapse arrow */}
              {hasExpandableChildren && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(!expanded);
                  }}
                  title="Expand/Collapse"
                >
                  <ChevronRight
                    size={14}
                    className={`text-tokyo-comment transition-transform duration-200 ${
                      expanded ? "rotate-90" : ""
                    }`}
                  />
                </button>
              )}

              {/* Icon and type */}
              <span className="text-sm" role="img" aria-label={nodeType}>
                {icon}
              </span>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={`font-medium text-sm ${style.text}`}>
                    {nodeType}
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-xs bg-tokyo-bg-dark font-family-mono p-4"
                >
                  <div className="space-y-2">
                    <p className="font-medium text-xs text-tokyo-fg">
                      {getNodeSummary(nodeType, node)}
                    </p>
                    <p className="text-xs text-tokyo-fg-dark">{description}</p>
                    {position && (
                      <div className="text-xs text-tokyo-blue bg-tokyo-blue/10 px-2 py-1 rounded">
                        Click to highlight code at line {position.start.line},{" "}
                        column {position.end.column}
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>

              {/* Simple properties */}
              {Object.keys(simpleProps).length > 0 && (
                <div className="flex gap-1 ml-2">
                  {Object.entries(simpleProps)
                    .slice(0, 2)
                    .map(([key, value]) => (
                      <Badge
                        key={key}
                        className="text-xs bg-tokyo-bg-highlight/60 text-tokyo-fg border-tokyo-comment/40 font-mono"
                      >
                        {key}: {value}
                      </Badge>
                    ))}
                </div>
              )}

              {/* Position badge */}
              {position && (
                <Badge
                  variant="outline"
                  className="text-xs text-tokyo-comment border-tokyo-comment/40 font-mono"
                >
                  <MapPin size={10} className="mr-1" />
                  {position.line}:{position.column}
                </Badge>
              )}

              {/* Click indicator */}
              {onNodeClick && position && (
                <div className="transition-colors text-tokyo-comment/60">
                  <Eye size={12} />
                </div>
              )}
            </div>

            {/* Child count */}
            {hasExpandableChildren && (
              <span className="text-xs text-tokyo-fg-dark">
                {Object.keys(complexProps).reduce((count, key) => {
                  const value = complexProps[key];
                  return count + (Array.isArray(value) ? value.length : 1);
                }, 0)}
              </span>
            )}
          </div>

          {/* Expanded content */}
          {expanded && hasExpandableChildren && (
            <div className="border-t border-tokyo-comment/30 bg-tokyo-bg-dark/30">
              <div className="p-3 space-y-3">
                {Object.entries(complexProps).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="text-xs text-tokyo-comment font-medium uppercase tracking-wide">
                      {key}
                      {Array.isArray(value) && (
                        <span className="ml-2 text-tokyo-fg-dark">
                          ({value.length})
                        </span>
                      )}
                    </div>

                    {Array.isArray(value) ? (
                      <div className="space-y-1">
                        {value.map((item, i) => (
                          <AstNode
                            key={`${path}-${key}-${i}`}
                            node={item}
                            depth={0}
                            path={`${path}.${key}[${i}]`}
                            isLast={i === value.length - 1}
                            onNodeClick={onNodeClick}
                          />
                        ))}
                      </div>
                    ) : (
                      <AstNode
                        node={value}
                        depth={0}
                        path={`${path}.${key}`}
                        isLast={true}
                        onNodeClick={onNodeClick}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AstNode;
