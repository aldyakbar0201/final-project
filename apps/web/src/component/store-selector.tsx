// components/StoreSelector.tsx
import { Store } from '../app/types/inventory';

interface StoreSelectorProps {
  stores: Store[];
  onSelectStore: (store: Store) => void;
}

export default function StoreSelector({
  stores,
  onSelectStore,
}: StoreSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Pilih Toko</label>
      <select
        onChange={(e) => {
          const selected = stores.find((store) => store.id === e.target.value);
          if (selected) onSelectStore(selected);
        }}
        className="p-2 border rounded-lg"
      >
        <option value="">-- Pilih Toko --</option>
        {stores.map((store) => (
          <option key={store.id} value={store.id}>
            {store.name}
          </option>
        ))}
      </select>
    </div>
  );
}
