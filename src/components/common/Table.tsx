import React, { useState, useMemo, memo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

// --- Types ---
export type TableAction = { label: string; value: string };
export type Column<T> = { key: keyof T; label: string; flex?: number };
export interface ActionTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions: TableAction[];
  onSaveChanges: (updates: Record<number, TableAction>) => Promise<void>;
}

// --- 1. Memoized Row Component ---
// This component will ONLY re-render if its own props change.
const TableRow = memo(({ 
  item, 
  columns, 
  actions, 
  isOpen, 
  currentSelection, 
  onToggle, 
  onSelect 
}: any) => {
  return (
    <View style={{ zIndex: isOpen ? 1000 : 1 }} className="bg-white">
      <View className="flex-row px-4 py-4 items-center border-b border-slate-100">
        {columns.map((col: any) => (
          <Text 
            key={String(col.key)} 
            className="text-slate-800 text-xs" 
            style={{ flex: col.flex ?? 1 }}
          >
            {String(item[col.key])}
          </Text>
        ))}

        <TouchableOpacity
          onPress={() => onToggle(isOpen ? null : item.id)}
          className={`px-2 py-2 rounded border items-center ${
            currentSelection 
              ? (currentSelection.value === 'reject' 
                  ? 'border-red-500 bg-red-300' 
                  : 'border-emerald-500 bg-emerald-200') 
              : 'border-slate-200 bg-slate-100'
          }`}
        >
          <Text 
            className={`text-[10px] font-bold ${
              currentSelection 
                ? (currentSelection.value === 'reject' 
                    ? 'text-red-700' 
                    : 'text-emerald-700') 
                : 'text-slate-500'
            }`}
          >
            {currentSelection ? currentSelection.label : 'Select'} ⌄
          </Text>
        </TouchableOpacity>
      </View>

      {isOpen && (
        <View 
          className="absolute right-2 top-12 bg-white rounded-lg shadow-xl border border-slate-200 w-44"
          style={{ zIndex: 9999, elevation: 11, position: 'absolute' }}
        >
          {actions.map((action: TableAction) => (
            <TouchableOpacity
              key={action.value}
              className="px-4 py-3 border-b border-slate-100 active:bg-slate-50"
              onPress={() => onSelect(item.id, action)}
            >
              <Text className={`font-medium text-xs ${action.value === 'reject' ? 'text-red-600' : 'text-slate-700'}`}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}, (prev, next) => {
  // Custom comparison: Only re-render if the open status or selection for THIS row changes
  return (
    prev.isOpen === next.isOpen && 
    prev.currentSelection?.value === next.currentSelection?.value
  );
});

// --- 2. Main Table Component ---
export function ActionTable<T extends { id: number }>({
  columns,
  data,
  actions,
  onSaveChanges,
}: ActionTableProps<T>) {
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const [selectedActions, setSelectedActions] = useState<Record<number, TableAction>>({});
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = useMemo(() => Object.keys(selectedActions).length > 0, [selectedActions]);

  // Use useCallback so these function references don't change on every render
  const handleSelect = useCallback((itemId: number, action: TableAction) => {
    setSelectedActions(prev => ({ ...prev, [itemId]: action }));
    setOpenRowId(null);
  }, []);

  const toggleRow = useCallback((id: number | null) => {
    setOpenRowId(id);
  }, []);

  const onSavePress = async () => {
    if (!hasChanges || isSaving) return;
    setIsSaving(true);
    try {
      await onSaveChanges(selectedActions);
      setSelectedActions({}); 
    } catch (error) {
      console.error("Save Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderItem = useCallback(({ item }: { item: T }) => (
    <TableRow
      item={item}
      columns={columns}
      actions={actions}
      isOpen={openRowId === item.id}
      currentSelection={selectedActions[item.id]}
      onToggle={toggleRow}
      onSelect={handleSelect}
    />
  ), [openRowId, selectedActions, columns, actions, toggleRow, handleSelect]);

  return (
    <View style={{ flexShrink: 1, overflow: 'visible' }}>
      <View style={{ overflow: 'visible', zIndex: 10 }}>
        {openRowId !== null && (
          <Pressable 
            onPress={() => setOpenRowId(null)} 
            style={StyleSheet.absoluteFill} 
            className="z-10"
          />
        )}

        <View className="flex-row bg-slate-100 px-4 py-3 rounded-t-xl border border-slate-300">
          {columns.map((col) => (
            <Text key={String(col.key)} className="font-semibold text-slate-600 text-xs" style={{ flex: col.flex ?? 1 }}>
              {col.label}
            </Text>
          ))}
          <Text className="font-semibold text-slate-600 w-24 text-center text-xs">Action</Text>
        </View>

        <FlatList
          data={data}
          extraData={openRowId || selectedActions} // Ensure list knows when these change
          keyExtractor={item => item.id.toString()}
          style={{ overflow: 'visible' }}
          contentContainerStyle={{ overflow: 'visible' }}
          className="border border-slate-200 border-t-0 rounded-b-xl bg-white"
          renderItem={renderItem}
          // Important for performance:
          removeClippedSubviews={false} 
        />
      </View>

      <View className="mt-8 pb-10">
        <TouchableOpacity
          onPress={onSavePress}
          disabled={!hasChanges || isSaving}
          className={`h-14 rounded-2xl flex-row justify-center items-center ${
            hasChanges ? 'bg-emerald-600' : 'bg-slate-300'
          }`}
        >
          {isSaving ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-base">Save Changes</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}