import React, { useState } from 'react';
import { EditableTable, Column } from './ui/editable-table';
import { X, Save, ExternalLink, Download, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { useCRM } from '../contexts/CRMContext';
import { toast } from 'sonner';

interface Culture {
  id: number;
  name: string;
  scientificName: string;
  family: string;
  origin: string;
  growingSeason: string;
  soilType: string;
  waterNeeds: string;
  fertilization: string;
  pests: string;
  diseases: string;
  notes: string;
  type: string;
  harvestPeriod: string;
  yieldPerHectare: string;
}

const initialCultureData: Culture[] = [
  {
    id: 1,
    name: 'Igname',
    scientificName: 'Dioscorea alata',
    family: 'Dioscoreaceae',
    origin: 'Asie du Sud-Est',
    growingSeason: 'Mai-Décembre',
    soilType: 'Argileux, bien drainé',
    waterNeeds: 'Modérés',
    fertilization: 'NPK 10-10-20',
    pests: 'Charançons, cochenilles',
    diseases: 'Anthracnose',
    notes: 'Culture importante en Guadeloupe, plusieurs variétés locales',
    type: 'tubers',
    harvestPeriod: '7-9 mois',
    yieldPerHectare: '15-25 tonnes'
  },
  {
    id: 2,
    name: 'Madère',
    scientificName: 'Colocasia esculenta',
    family: 'Araceae',
    origin: 'Asie du Sud-Est',
    growingSeason: 'Toute l\'année',
    soilType: 'Humide, riche en matière organique',
    waterNeeds: 'Élevés',
    fertilization: 'NPK 14-14-14',
    pests: 'Pucerons',
    diseases: 'Pourriture des racines',
    notes: 'Cultivé dans les zones humides',
    type: 'tubers',
    harvestPeriod: '9-12 mois',
    yieldPerHectare: '10-15 tonnes'
  },
  {
    id: 3,
    name: 'Christophine',
    scientificName: 'Sechium edule',
    family: 'Cucurbitaceae',
    origin: 'Amérique centrale',
    growingSeason: 'Toute l\'année',
    soilType: 'Bien drainé, riche',
    waterNeeds: 'Modérés à élevés',
    fertilization: 'NPK 12-12-17',
    pests: 'Mouches blanches, acariens',
    diseases: 'Mildiou',
    notes: 'Culture sur treillage',
    type: 'vegetables',
    harvestPeriod: '2-3 mois',
    yieldPerHectare: '30-40 tonnes'
  },
  {
    id: 4,
    name: 'Canne à Sucre',
    scientificName: 'Saccharum officinarum',
    family: 'Poaceae',
    origin: 'Nouvelle-Guinée',
    growingSeason: 'Toute l\'année',
    soilType: 'Argileux, profond',
    waterNeeds: 'Élevés',
    fertilization: 'NPK 16-4-16',
    pests: 'Foreur des tiges, pucerons',
    diseases: 'Charbon, rouille',
    notes: 'Culture principale économique de Guadeloupe',
    type: 'cash',
    harvestPeriod: '11-13 mois',
    yieldPerHectare: '70-100 tonnes'
  },
  {
    id: 5,
    name: 'Banane',
    scientificName: 'Musa paradisiaca',
    family: 'Musaceae',
    origin: 'Asie du Sud-Est',
    growingSeason: 'Toute l\'année',
    soilType: 'Limoneux, profond',
    waterNeeds: 'Élevés',
    fertilization: 'NPK 14-4-28',
    pests: 'Charançon, thrips',
    diseases: 'Cercosporiose, fusariose',
    notes: 'Principalement pour l\'exportation',
    type: 'fruits',
    harvestPeriod: '10-14 mois',
    yieldPerHectare: '30-60 tonnes'
  }
];

interface CultureDetailTableProps {
  searchTerm?: string;
  filterType?: string;
  showAddForm?: boolean;
  setShowAddForm?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CultureDetailTable = ({ 
  searchTerm = '',
  filterType = 'all',
  showAddForm = false,
  setShowAddForm,
}: CultureDetailTableProps) => {
  const { toast: shadowToast } = useToast();
  const [cultureData, setCultureData] = useState(initialCultureData);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [selectedCulture, setSelectedCulture] = useState<Culture | null>(null);
  const { exportModuleData } = useCRM();
  const [newCulture, setNewCulture] = useState({
    name: '',
    scientificName: '',
    family: '',
    origin: '',
    growingSeason: '',
    soilType: '',
    waterNeeds: '',
    fertilization: '',
    pests: '',
    diseases: '',
    notes: '',
    type: 'vegetables',
    harvestPeriod: '',
    yieldPerHectare: ''
  });

  // Respect caller-controlled form visibility when provided
  const localShowAddForm = typeof setShowAddForm === 'function' ? showAddForm : isAddFormVisible;
  const localSetShowAddForm = typeof setShowAddForm === 'function' ? setShowAddForm : setIsAddFormVisible;

  const filteredCultures = cultureData.filter(culture => {
    const matchesSearch = 
      culture.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      culture.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      culture.family.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && culture.type === filterType;
  });

  const handleUpdateCulture = (rowIndex: number, columnId: string, value: string) => {
    const updatedData = [...cultureData];
    const targetIndex = cultureData.findIndex(c => c.id === filteredCultures[rowIndex].id);
    
    if (targetIndex !== -1) {
      updatedData[targetIndex] = {
        ...updatedData[targetIndex],
        [columnId]: value
      };
      setCultureData(updatedData);
      
      shadowToast({
        description: `Đã cập nhật thông tin cho ${updatedData[targetIndex].name}`,
      });
    }
  };

  const handleAddCulture = () => {
    if (!newCulture.name) {
      toast.error("Lỗi", {
        description: "Tên cây trồng là bắt buộc"
      });
      return;
    }

    const newId = Math.max(...cultureData.map(c => c.id), 0) + 1;
    setCultureData([...cultureData, { ...newCulture, id: newId }]);
    localSetShowAddForm(false);
    
    setNewCulture({
      name: '',
      scientificName: '',
      family: '',
      origin: '',
      growingSeason: '',
      soilType: '',
      waterNeeds: '',
      fertilization: '',
      pests: '',
      diseases: '',
      notes: '',
      type: 'vegetables',
      harvestPeriod: '',
      yieldPerHectare: ''
    });
    
    toast.success("Thêm cây trồng thành công", {
      description: `${newCulture.name} đã được thêm vào danh sách cây trồng`
    });
  };

  const handleDeleteCulture = (rowIndex: number) => {
    const cultureToDelete = filteredCultures[rowIndex];
    const updatedData = cultureData.filter(culture => culture.id !== cultureToDelete.id);
    setCultureData(updatedData);
    
    toast.success("Xóa cây trồng thành công", {
      description: `${cultureToDelete.name} đã được xóa khỏi danh sách`
    });
  };

  const handleViewDetails = (rowIndex: number) => {
    setSelectedCulture(filteredCultures[rowIndex]);
  };

  const downloadTechnicalSheet = async (culture: Culture) => {
    toast.info("Đang tạo phiếu kỹ thuật", {
      description: `Chuẩn bị phiếu cho ${culture.name}`
    });
    
    const techSheetData = [{
      nom: culture.name,
      nomScientifique: culture.scientificName,
      famille: culture.family,
      origine: culture.origin,
      saisonCulture: culture.growingSeason,
      typeSol: culture.soilType,
      besoinEau: culture.waterNeeds,
      fertilisation: culture.fertilization,
      ravageurs: culture.pests,
      maladies: culture.diseases,
      notes: culture.notes,
      type: culture.type,
      periodeRecolte: culture.harvestPeriod,
      rendementHectare: culture.yieldPerHectare
    }];
    
    const success = await exportModuleData('fiche_technique', 'pdf', techSheetData);
    
    if (success) {
      toast.success("Phiếu kỹ thuật đã được tạo", {
        description: `Phiếu kỹ thuật cho ${culture.name} đã được tải xuống`
      });
    }
  };

  const columns: Column[] = [
  { id: 'name', header: 'Tên', accessorKey: 'name', isEditable: true },
  { id: 'scientificName', header: 'Tên khoa học', accessorKey: 'scientificName', isEditable: true },
  { id: 'growingSeason', header: 'Mùa trồng', accessorKey: 'growingSeason', isEditable: true },
  { id: 'soilType', header: 'Loại đất', accessorKey: 'soilType', isEditable: true },
  { id: 'waterNeeds', header: 'Nhu cầu nước', accessorKey: 'waterNeeds', isEditable: true }
  ];

  const renderDetailView = () => {
    if (!selectedCulture) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-3xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Détails de la culture: {selectedCulture.name}</h2>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCulture(null)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Nom</Label>
              <Input 
                value={selectedCulture.name}
                onChange={(e) => {
                  const newName = e.target.value;
                  setSelectedCulture({...selectedCulture, name: newName});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].name = newName;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Nom scientifique</Label>
              <Input 
                value={selectedCulture.scientificName}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, scientificName: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].scientificName = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Type de culture</Label>
              <select 
                value={selectedCulture.type}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, type: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].type = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="w-full h-10 border border-input rounded-md px-3 mt-1"
              >
                <option value="vegetables">Légumes</option>
                <option value="fruits">Fruits</option>
                <option value="tubers">Tubercules</option>
                <option value="cash">Cultures de rente</option>
              </select>
            </div>
            
            <div>
              <Label>Famille</Label>
              <Input 
                value={selectedCulture.family}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, family: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].family = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Origine</Label>
              <Input 
                value={selectedCulture.origin}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, origin: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].origin = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Saison de culture</Label>
              <Input 
                value={selectedCulture.growingSeason}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, growingSeason: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].growingSeason = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Période de récolte</Label>
              <Input 
                value={selectedCulture.harvestPeriod}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, harvestPeriod: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].harvestPeriod = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Rendement par hectare</Label>
              <Input 
                value={selectedCulture.yieldPerHectare}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, yieldPerHectare: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].yieldPerHectare = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Type de sol</Label>
              <Input 
                value={selectedCulture.soilType}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, soilType: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].soilType = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Besoin en eau</Label>
              <Input 
                value={selectedCulture.waterNeeds}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, waterNeeds: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].waterNeeds = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Fertilisation</Label>
              <Input 
                value={selectedCulture.fertilization}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, fertilization: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].fertilization = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Ravageurs</Label>
              <Input 
                value={selectedCulture.pests}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, pests: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].pests = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Maladies</Label>
              <Input 
                value={selectedCulture.diseases}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, diseases: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].diseases = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label>Notes</Label>
            <Textarea 
              value={selectedCulture.notes}
              onChange={(e) => {
                const newValue = e.target.value;
                setSelectedCulture({...selectedCulture, notes: newValue});
                
                const updatedData = [...cultureData];
                const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                if (index !== -1) {
                  updatedData[index].notes = newValue;
                  setCultureData(updatedData);
                }
              }}
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-5">
            <Button 
              variant="outline"
              onClick={() => setSelectedCulture(null)}
            >
              Fermer
            </Button>
            <Button onClick={() => downloadTechnicalSheet(selectedCulture)}>
              <FileText className="mr-2 h-4 w-4" />
              Télécharger fiche technique
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            toast.info("Guide PDF disponible", {
              description: "Téléchargement du guide des cultures tropicales démarré"
            });
            exportModuleData('guide_cultures', 'pdf');
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Guide des cultures
        </Button>
      </div>
      
      <EditableTable
        data={filteredCultures}
        columns={columns}
        onUpdate={handleUpdateCulture}
        onDelete={handleDeleteCulture}
        onAdd={localShowAddForm ? undefined : () => localSetShowAddForm(true)}
        sortable={true}
        actions={[
          {
            icon: <ExternalLink className="h-4 w-4" />,
            label: "Voir détails",
            onClick: handleViewDetails
          }
        ]}
      />
      
      {localShowAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ajouter une nouvelle culture</h2>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => localSetShowAddForm(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom de la culture *</Label>
                  <Input 
                    id="name"
                    type="text" 
                    className="mt-1"
                    value={newCulture.name}
                    onChange={(e) => setNewCulture({...newCulture, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="scientificName">Nom scientifique</Label>
                  <Input 
                    id="scientificName"
                    type="text" 
                    className="mt-1"
                    value={newCulture.scientificName}
                    onChange={(e) => setNewCulture({...newCulture, scientificName: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Type de culture</Label>
                  <select 
                    id="type"
                    className="w-full h-10 border border-input rounded-md px-3 mt-1"
                    value={newCulture.type}
                    onChange={(e) => setNewCulture({...newCulture, type: e.target.value})}
                  >
                    <option value="vegetables">Légumes</option>
                    <option value="fruits">Fruits</option>
                    <option value="tubers">Tubercules</option>
                    <option value="cash">Cultures de rente</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="family">Famille</Label>
                  <Input 
                    id="family"
                    type="text" 
                    className="mt-1"
                    value={newCulture.family}
                    onChange={(e) => setNewCulture({...newCulture, family: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="origin">Origine</Label>
                  <Input 
                    id="origin"
                    type="text" 
                    className="mt-1"
                    value={newCulture.origin}
                    onChange={(e) => setNewCulture({...newCulture, origin: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="growingSeason">Saison de culture</Label>
                  <Input 
                    id="growingSeason"
                    type="text" 
                    className="mt-1"
                    value={newCulture.growingSeason}
                    onChange={(e) => setNewCulture({...newCulture, growingSeason: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="harvestPeriod">Période de récolte</Label>
                  <Input 
                    id="harvestPeriod"
                    type="text" 
                    className="mt-1"
                    value={newCulture.harvestPeriod}
                    onChange={(e) => setNewCulture({...newCulture, harvestPeriod: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="yieldPerHectare">Rendement par hectare</Label>
                  <Input 
                    id="yieldPerHectare"
                    type="text" 
                    className="mt-1"
                    value={newCulture.yieldPerHectare}
                    onChange={(e) => setNewCulture({...newCulture, yieldPerHectare: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="soilType">Type de sol</Label>
                  <Input 
                    id="soilType"
                    type="text" 
                    className="mt-1"
                    value={newCulture.soilType}
                    onChange={(e) => setNewCulture({...newCulture, soilType: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="waterNeeds">Besoin en eau</Label>
                  <Input 
                    id="waterNeeds"
                    type="text" 
                    className="mt-1"
                    value={newCulture.waterNeeds}
                    onChange={(e) => setNewCulture({...newCulture, waterNeeds: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="fertilization">Fertilisation</Label>
                  <Input 
                    id="fertilization"
                    type="text" 
                    className="mt-1"
                    value={newCulture.fertilization}
                    onChange={(e) => setNewCulture({...newCulture, fertilization: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="pests">Ravageurs</Label>
                  <Input 
                    id="pests"
                    type="text" 
                    className="mt-1"
                    value={newCulture.pests}
                    onChange={(e) => setNewCulture({...newCulture, pests: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="diseases">Maladies</Label>
                  <Input 
                    id="diseases"
                    type="text" 
                    className="mt-1"
                    value={newCulture.diseases}
                    onChange={(e) => setNewCulture({...newCulture, diseases: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes"
                  className="mt-1"
                  rows={3}
                  value={newCulture.notes}
                  onChange={(e) => setNewCulture({...newCulture, notes: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => localSetShowAddForm(false)}
                >
                  Annuler
                </Button>
                <Button 
                  type="button"
                  onClick={handleAddCulture}
                >
                  <Save className="mr-2" />
                  Enregistrer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {selectedCulture && renderDetailView()}
    </div>
  );
};
