import React, { useState } from 'react';
// EditableField removed; using static text/inputs instead
import { EditableTable, Column } from './ui/editable-table';
import { 
  Map, 
  MapPin, 
  Camera,
  Plus,
  Trash2,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface ParcelDetail {
  id: string;
  name: string;
  location: string;
  surface: number;
  soilType: string;
  crops: { crop: string; variety: string; plantingDate: string; harvestDate: string; status: string }[];
  irrigationSystem: string;
  notes: string;
  owner: string;
  lastInspection: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  images: string[];
}

interface TaskData {
  id: number;
  task: string;
  dueDate: string;
  assignedTo: string;
  priority: 'Thấp' | 'Trung bình' | 'Cao' | 'Khẩn';
  status: 'Chưa làm' | 'Đang làm' | 'Hoàn thành';
}

const parcelData: ParcelDetail = {
  id: '1',
  name: 'Parcelle des Hauts Palmiers',
  location: 'Grande-Terre - Morne-à-l\'Eau',
  surface: 8.5,
  soilType: 'Argilo-calcaire',
  crops: [
    { 
      crop: 'Canne à Sucre', 
      variety: 'R579', 
      plantingDate: '2023-02-10', 
      harvestDate: '2024-02-15',
  status: 'Đang phát triển'
    },
    { 
      crop: 'Igname', 
      variety: 'Pacala', 
      plantingDate: '2023-05-20', 
      harvestDate: '2023-12-10',
  status: 'Đã thu hoạch'
    }
  ],
  irrigationSystem: 'Tưới nhỏ giọt với thu nước mưa',
  notes: 'Thửa đang chuyển sang hữu cơ từ 2022. Hướng Đông Nam thuận lợi.',
  owner: 'Hợp tác xã Nông nghiệp Grande-Terre',
  lastInspection: '2023-11-15',
  coordinates: {
    latitude: 16.3312,
    longitude: -61.3844
  },
  images: [
    'parcelle1_vue1.jpg',
    'parcelle1_irrigation.jpg'
  ]
};

const initialTasks: TaskData[] = [
  { 
    id: 1, 
    task: 'Fertilisation de la canne', 
    dueDate: '2023-09-25', 
    assignedTo: 'Jean Dupont', 
    priority: 'Cao',
      status: 'Chưa làm'
  },
  { 
    id: 2, 
    task: 'Traitement contre la cercosporiose', 
    dueDate: '2023-09-28', 
    assignedTo: 'Marie Lambert', 
    priority: 'Trung bình',
      status: 'Đang làm'
  },
  { 
    id: 3, 
    task: 'Inspection croissance ananas', 
    dueDate: '2023-09-30', 
    assignedTo: 'Pierre Lafortune', 
    priority: 'Thấp',
      status: 'Chưa làm'
  },
  {
    id: 4,
    task: 'Désherbage parcelle madère',
    dueDate: '2023-10-05',
    assignedTo: 'Sophie Martin',
    priority: 'Trung bình',
      status: 'Chưa làm'
  },
  {
    id: 5,
    task: 'Préparation coupe canne',
    dueDate: '2024-01-10',
    assignedTo: 'Jean Dupont',
    priority: 'Cao',
      status: 'Chưa làm'
  }
];

const taskColumns: Column[] = [
  { id: 'task', header: 'Công việc', accessorKey: 'task', isEditable: true },
  { id: 'assignedTo', header: 'Giao cho', accessorKey: 'assignedTo', isEditable: true },
  { id: 'dueDate', header: 'Ngày', accessorKey: 'dueDate', isEditable: true, width: '120px' },
  { id: 'priority', header: 'Ưu tiên', accessorKey: 'priority', isEditable: true, width: '120px' },
  { id: 'status', header: 'Trạng thái', accessorKey: 'status', isEditable: true, width: '100px' }
];

const cropColumns: Column[] = [
  { id: 'crop', header: 'Cây trồng', accessorKey: 'crop', isEditable: true },
  { id: 'variety', header: 'Giống', accessorKey: 'variety', isEditable: true },
  { id: 'plantingDate', header: 'Ngày trồng', accessorKey: 'plantingDate', isEditable: true },
  { id: 'harvestDate', header: 'Ngày dự kiến thu hoạch', accessorKey: 'harvestDate', isEditable: true },
  { id: 'status', header: 'Trạng thái', accessorKey: 'status', isEditable: true },
];

const GuadeloupeParcelDetail = () => {
  const [parcel, setParcel] = useState<ParcelDetail>(parcelData);
  const [tasks, setTasks] = useState<TaskData[]>(initialTasks);
  const [activeTab, setActiveTab] = useState<'info' | 'crops' | 'tasks'>('info');
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleParcelUpdate = (field: keyof ParcelDetail, value: string | number) => {
    setParcel({
      ...parcel,
      [field]: value
    });
    toast.success(`${field} mis à jour`);
  };

  const handleTaskUpdate = (rowIndex: number, columnId: string, value: string) => {
    const updatedTasks = [...tasks];
    const updatedTask = { ...updatedTasks[rowIndex] };
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updatedTask as any)[columnId] = value;
    updatedTasks[rowIndex] = updatedTask;
    
    setTasks(updatedTasks);
    toast.success('Cập nhật công việc thành công');
  };

  const handleCropUpdate = (rowIndex: number, columnId: string, value: string) => {
    const updatedParcel = { ...parcel };
    const updatedCrops = [...updatedParcel.crops];
    const updatedCrop = { ...updatedCrops[rowIndex] };
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updatedCrop as any)[columnId] = value;
    updatedCrops[rowIndex] = updatedCrop;
    
    updatedParcel.crops = updatedCrops;
    setParcel(updatedParcel);
    toast.success('Cập nhật cây trồng thành công');
  };

  const handleAddTask = (newRow: Record<string, string>) => {
    const newId = Math.max(0, ...tasks.map(t => t.id)) + 1;
    
    const newTask: TaskData = {
      id: newId,
      task: String(newRow.task || ''),
      dueDate: String(newRow.dueDate || new Date().toISOString().split('T')[0]),
      assignedTo: String(newRow.assignedTo || ''),
      priority: (newRow.priority as TaskData['priority']) || 'Trung bình',
      status: (newRow.status as TaskData['status']) || 'Chưa làm'
    };
    
    setTasks([...tasks, newTask]);
    toast.success('Thêm công việc mới thành công');
  };

  const handleAddCrop = (newRow: Record<string, string>) => {
    const updatedParcel = { ...parcel };
    
    const newCrop = {
      crop: String(newRow.crop || ''),
      variety: String(newRow.variety || ''),
      plantingDate: String(newRow.plantingDate || new Date().toISOString().split('T')[0]),
      harvestDate: String(newRow.harvestDate || ''),
      status: String(newRow.status || 'Đã lên kế hoạch')
    };
    
    updatedParcel.crops = [...updatedParcel.crops, newCrop];
    setParcel(updatedParcel);
    toast.success('Thêm cây trồng mới thành công');
  };

  const handleDeleteTask = (rowIndex: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(rowIndex, 1);
    setTasks(updatedTasks);
    toast.success('Xóa công việc thành công');
  };

  const handleDeleteCrop = (rowIndex: number) => {
    const updatedParcel = { ...parcel };
    const updatedCrops = [...updatedParcel.crops];
    updatedCrops.splice(rowIndex, 1);
    updatedParcel.crops = updatedCrops;
    setParcel(updatedParcel);
    toast.success('Xóa cây trồng thành công');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <MapPin className="h-6 w-6 mr-2 text-agri-primary" />
              <span className="inline-block font-semibold">{parcel.name}</span>
            </h2>
            <p className="text-muted-foreground flex items-center mt-1">
              <Map className="h-4 w-4 mr-1.5" />
              <span className="inline-block">{parcel.location}</span>
            </p>
          </div>
          
          <div className="flex space-x-2 mt-4 lg:mt-0">
            <button 
              className={`px-4 py-2 rounded-lg ${activeTab === 'info' ? 'bg-agri-primary text-white' : 'bg-muted'}`}
              onClick={() => setActiveTab('info')}
            >
              Informations
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${activeTab === 'crops' ? 'bg-agri-primary text-white' : 'bg-muted'}`}
              onClick={() => setActiveTab('crops')}
            >
              Cultures
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${activeTab === 'tasks' ? 'bg-agri-primary text-white' : 'bg-muted'}`}
              onClick={() => setActiveTab('tasks')}
            >
              Tâches
            </button>
          </div>
        </div>
        
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Superficie</h3>
                <div className="flex items-center">
                  <input
                    type="number"
                    className="text-xl font-bold border rounded px-2 py-1"
                    defaultValue={String(parcel.surface)}
                    onBlur={(e) => handleParcelUpdate('surface', Number(e.target.value))}
                  />
                  <span className="ml-1 text-xl">ha</span>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Type de sol</h3>
                <input
                  className="text-xl font-bold border rounded px-2 py-1"
                  defaultValue={parcel.soilType}
                  onBlur={(e) => handleParcelUpdate('soilType', e.target.value)}
                />
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Dernière inspection</h3>
                <input
                  className="text-xl font-bold border rounded px-2 py-1"
                  defaultValue={parcel.lastInspection}
                  onBlur={(e) => handleParcelUpdate('lastInspection', e.target.value)}
                />
              </div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Système d'irrigation</h3>
              <textarea
                className="w-full border rounded px-2 py-2"
                defaultValue={parcel.irrigationSystem}
                onBlur={(e) => handleParcelUpdate('irrigationSystem', e.target.value)}
              />
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
              <textarea
                className="w-full border rounded px-2 py-2"
                defaultValue={parcel.notes}
                onBlur={(e) => handleParcelUpdate('notes', e.target.value)}
              />
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Propriétaire</h3>
              <input
                className="w-full border rounded px-2 py-1"
                defaultValue={parcel.owner}
                onBlur={(e) => handleParcelUpdate('owner', e.target.value)}
              />
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">Photos de la parcelle</h3>
                <button 
                  className="text-sm flex items-center text-agri-primary hover:text-agri-primary-dark"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter une photo
                </button>
              </div>
              
              {showImageUpload && (
                <div className="mb-4 p-3 border border-dashed rounded-lg">
                  <div className="flex flex-col items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Glissez une image ou cliquez pour parcourir</p>
                    <Input type="file" className="max-w-xs" />
                    <div className="flex space-x-2 mt-2">
                      <button className="px-3 py-1 text-sm bg-agri-primary text-white rounded">Télécharger</button>
                      <button 
                        className="px-3 py-1 text-sm border rounded"
                        onClick={() => setShowImageUpload(false)}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {parcel.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="h-24 w-full bg-gray-100 rounded flex items-center justify-center border">
                      <span className="text-xs text-muted-foreground">{image}</span>
                    </div>
                    <button className="absolute top-1 right-1 hidden group-hover:flex p-1 bg-red-100 rounded-full text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'crops' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Cultures sur cette parcelle</h3>
            <EditableTable
              data={parcel.crops}
              columns={cropColumns}
              onUpdate={handleCropUpdate}
              onDelete={handleDeleteCrop}
              onAdd={handleAddCrop}
              className="border-none"
            />
          </div>
        )}
        
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Công việc sắp tới</h3>
              <Button 
                onClick={() => toast.success('Chuyển đến trang công việc')}
                variant="outline"
                className="text-sm"
              >
                Xem tất cả công việc
              </Button>
            </div>
            
            <EditableTable
              data={tasks}
              columns={taskColumns}
              onUpdate={handleTaskUpdate}
              onDelete={handleDeleteTask}
              onAdd={handleAddTask}
              className="border-none"
              actions={[
                {
                  icon: <Check className="h-4 w-4 text-green-600" />,
                  label: "Đánh dấu hoàn thành",
                  onClick: (rowIndex) => {
                    toast.success(`Công việc "${tasks[rowIndex].task}" đã được đánh dấu hoàn thành`);
                    const updatedTasks = [...tasks];
                    updatedTasks[rowIndex].status = 'Hoàn thành';
                    setTasks(updatedTasks);
                  }
                }
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GuadeloupeParcelDetail;
