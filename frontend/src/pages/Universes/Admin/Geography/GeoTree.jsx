import { Fragment, useCallback, useMemo, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ChevronDown, ChevronRight, GripHorizontal, Pencil, Plus } from "lucide-react";

import { useTranslation } from "@/services/translation";

import { OykButton, OykCard } from "@/components/ui";

const ITEM_TYPE = "geo-node";

const PARENT_TYPE = {
  sector: "zone",
  division: "sector",
};

export default function OykGeoTree({ items = [], setItems = () => {} }) {
  /**
   * Move a dragged node to a new parent at a given position.
   * All position values are re-packed so there are no gaps.
   */
  const moveNode = useCallback((draggedUid, newParentUid, newPosition) => {
    setItems((prev) => {
      const next = prev.map((item) => ({ ...item }));
      const dragged = next.find((item) => item.uid === draggedUid);
      if (!dragged) return prev;

      const oldParentUid = dragged.parentUid;

      // Re-pack old siblings (excluding the dragged item)
      next
        .filter((item) => item.parentUid === oldParentUid && item.uid !== draggedUid)
        .sort((a, b) => a.position - b.position)
        .forEach((item, i) => {
          item.position = i;
        });

      // Insert dragged item among new siblings at the requested position
      const newSiblings = next
        .filter((item) => item.parentUid === newParentUid && item.uid !== draggedUid)
        .sort((a, b) => a.position - b.position);

      dragged.parentUid = newParentUid;
      newSiblings.splice(newPosition, 0, dragged);
      newSiblings.forEach((item, i) => {
        item.position = i;
      });

      return next;
    });
  }, []);

  // Build a uid→children map once per render for O(1) child lookups
  const childrenMap = useMemo(() => {
    const map = new Map();
    for (const item of items) {
      const key = item.parentUid ?? null;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    }
    // Sort each bucket by position
    for (const [, children] of map) {
      children.sort((a, b) => a.position - b.position);
    }
    return map;
  }, [items]);

  const roots = childrenMap.get(null) ?? [];

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <OykGeoTreeDropline parentUid={null} position={0} moveNode={moveNode} items={items} />
        {roots.map((item, index) => (
          <Fragment key={item.uid}>
            <OykGeoTreeNode item={item} childrenMap={childrenMap} moveNode={moveNode} items={items} />
            <OykGeoTreeDropline parentUid={null} position={index + 1} moveNode={moveNode} items={items} />
          </Fragment>
        ))}
      </div>
    </DndProvider>
  );
}

function OykGeoTreeNode({ item, childrenMap, moveNode, items, depth = 0 }) {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(true);

  const children = childrenMap.get(item.uid) ?? [];

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: ITEM_TYPE,
      item: { uid: item.uid, type: item.type },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [item.uid, item.type],
  );

  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: ITEM_TYPE,
      canDrop: (dragged) => {
        if (dragged.uid === item.uid) return false;
        const expectedParentType = PARENT_TYPE[dragged.type];
        return expectedParentType === item.type;
      },
      drop: (dragged) => {
        moveNode(dragged.uid, item.uid, children.length);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [item.uid, item.type, children.length, moveNode],
  );

  return (
    <div style={{ marginLeft: depth * 24 }}>
      <OykCard
        ref={dropRef}
        nop
        style={{
          border: isOver && canDrop ? "2px dashed var(--oyk-c-primary)" : "2px solid transparent",
          opacity: isDragging ? 0.4 : 1,
          transition: "border-color 0.15s ease, opacity 0.15s ease",
        }}
      >
        <div
          ref={dragRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px",
          }}
        >
          <GripHorizontal size={16} style={{ color: "var(--oyk-card-fg)", flexShrink: 0, cursor: "grab" }} />

          {children.length > 0 && (
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: 0,
                color: "var(--oyk-card-fg)",
              }}
              aria-label={isOpen ? t("Réduire") : t("Développer")}
            >
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}

          <span style={{ marginLeft: 6, flex: 1 }}>{item.name}</span>

          <OykButton small plain icon={Pencil} />
          {item.type === "zone" && (<OykButton small plain icon={Plus} />)}
          {item.type === "sector" && (<OykButton small plain icon={Plus} disabled />)}
        </div>
      </OykCard>

      {isOpen && children.length > 0 && (
        <div
          style={{
            borderLeft: "1px dashed var(--oyk-core-divider)",
            marginLeft: 17,
          }}
        >
          <OykGeoTreeDropline parentUid={item.uid} position={0} moveNode={moveNode} items={items} />
          {children.map((child, index) => (
            <Fragment key={child.uid}>
              <OykGeoTreeNode
                item={child}
                childrenMap={childrenMap}
                moveNode={moveNode}
                items={items}
                depth={depth + 1}
              />
              <OykGeoTreeDropline parentUid={item.uid} position={index + 1} moveNode={moveNode} items={items} />
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

function OykGeoTreeDropline({ parentUid, position, moveNode, items }) {
  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: ITEM_TYPE,
      canDrop: (dragged) => {
        if (parentUid === null) return dragged.type === "zone";

        const parent = items.find((item) => item.uid === parentUid);
        if (!parent) return false;

        return PARENT_TYPE[dragged.type] === parent.type;
      },
      drop: (dragged) => {
        moveNode(dragged.uid, parentUid, position);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [parentUid, position, moveNode, items],
  );

  return (
    <div
      ref={dropRef}
      style={{
        background: isOver && canDrop ? "var(--oyk-c-primary)" : "transparent",
        borderRadius: "var(--oyk-radius)",
        height: 8,
        margin: "2px 0",
        transition: "background 0.15s ease",
      }}
    />
  );
}
