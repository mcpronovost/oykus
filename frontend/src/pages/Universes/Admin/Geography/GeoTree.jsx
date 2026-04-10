import { Fragment, useCallback, useMemo, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ChevronDown, ChevronRight, GripHorizontal, Lock, Pencil, Plus } from "lucide-react";

import { useTranslation } from "@/services/translation";

import { OykButton, OykCard, OykChip } from "@/components/ui";
import OykModalZoneCreate from "./modals/ZoneCreate";
import OykModalZoneEdit from "./modals/ZoneEdit";
import OykModalSectorCreate from "./modals/SectorCreate";
import OykModalSectorEdit from "./modals/SectorEdit";
import OykModalDivisionCreate from "./modals/DivisionCreate";
import OykModalDivisionEdit from "./modals/DivisionEdit";

const ITEM_TYPE = "geo-node";

const PARENT_TYPE = {
  sector: "zone",
  division: "sector",
};

export default function OykGeoTree({ items = [], setItems = () => {}, updateItems = () => {}, universePlan = "free" }) {
  const { t } = useTranslation();

  const [isModalZoneCreateOpen, setIsModalZoneCreateOpen] = useState(false);
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

  const handleCloseModal = (updated) => {
    setIsModalZoneCreateOpen(false);
    if (updated) {
      updateItems();
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <OykModalZoneCreate isOpen={isModalZoneCreateOpen} onClose={handleCloseModal} position={roots.length} />
        <OykGeoTreeDropline parentUid={null} position={0} moveNode={moveNode} items={items} />
        {roots.map((item, index) => (
          <Fragment key={item.uid}>
            <OykGeoTreeNode
              item={item}
              childrenMap={childrenMap}
              moveNode={moveNode}
              items={items}
              updateItems={updateItems}
              universePlan={universePlan}
            />
            <OykGeoTreeDropline parentUid={null} position={index + 1} moveNode={moveNode} items={items} />
            {roots.length - 1 === index ? (
              <OykButton color="default" onClick={() => setIsModalZoneCreateOpen(true)}>
                {t("Create a new zone")}
              </OykButton>
            ) : null}
          </Fragment>
        ))}
      </div>
    </DndProvider>
  );
}

function OykGeoTreeNode({
  item,
  childrenMap,
  moveNode,
  items,
  depth = 0,
  updateItems = () => {},
  universePlan = "free",
}) {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(true);
  const [isModalZoneEditOpen, setIsModalZoneEditOpen] = useState(false);
  const [isModalSectorCreateOpen, setIsModalSectorCreateOpen] = useState(false);
  const [isModalSectorEditOpen, setIsModalSectorEditOpen] = useState(false);
  const [isModalDivisionCreateOpen, setIsModalDivisionCreateOpen] = useState(false);
  const [isModalDivisionEditOpen, setIsModalDivisionEditOpen] = useState(false);

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

  const handleCloseModal = (updated) => {
    setIsModalZoneEditOpen(false);
    setIsModalSectorCreateOpen(false);
    setIsModalSectorEditOpen(false);
    setIsModalDivisionCreateOpen(false);
    setIsModalDivisionEditOpen(false);
    if (updated) {
      updateItems();
    }
  };

  return (
    <>
      {item.type === "zone" && (
        <>
          <OykModalZoneEdit isOpen={isModalZoneEditOpen} onClose={handleCloseModal} zone={item} />
          <OykModalSectorCreate
            isOpen={isModalSectorCreateOpen}
            onClose={handleCloseModal}
            zoneId={item.id}
            position={children.length}
          />
        </>
      )}
      {item.type === "sector" && (
        <>
          <OykModalSectorEdit
            isOpen={isModalSectorEditOpen}
            onClose={handleCloseModal}
            sector={item}
            zoneId={item.parentId}
          />
          <OykModalDivisionCreate
            isOpen={isModalDivisionCreateOpen}
            onClose={handleCloseModal}
            sectorId={item.id}
            position={children.length}
          />
        </>
      )}
      {item.type === "division" && (
        <>
          <OykModalDivisionEdit
            isOpen={isModalDivisionEditOpen}
            onClose={handleCloseModal}
            division={item}
            sectorId={item.parentId}
          />
        </>
      )}
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

            <div
              style={{ display: "flex", flex: 1, flexDirection: "row", alignItems: "center", gap: 8, marginLeft: 6 }}
            >
              <span>{item.name}</span>
              {item.is_locked ? (
                <span
                  style={{
                    backgroundColor: "var(--oyk-card-subtle-bg)",
                    borderRadius: "var(--oyk-radius)",
                    padding: "0 6px",
                  }}
                >
                  <Lock size={13} />
                </span>
              ) : null}
            </div>

            {item.type === "zone" && (
              <>
                <OykButton small plain icon={Pencil} onClick={() => setIsModalZoneEditOpen(true)} />
                <OykButton small plain icon={Plus} onClick={() => setIsModalSectorCreateOpen(true)} />
              </>
            )}
            {item.type === "sector" && (
              <>
                <OykButton small plain icon={Pencil} onClick={() => setIsModalSectorEditOpen(true)} />
                {["frontier", "dominion"].includes(universePlan) ? (
                  <OykButton small plain icon={Plus} onClick={() => setIsModalDivisionCreateOpen(true)} />
                ) : (
                  <OykButton small plain icon={Plus} disabled />
                )}
              </>
            )}
            {item.type === "division" && (
              <>
                <OykButton small plain icon={Pencil} onClick={() => setIsModalDivisionEditOpen(true)} />
              </>
            )}
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
                  updateItems={updateItems}
                  universePlan={universePlan}
                />
                <OykGeoTreeDropline parentUid={item.uid} position={index + 1} moveNode={moveNode} items={items} />
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </>
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
