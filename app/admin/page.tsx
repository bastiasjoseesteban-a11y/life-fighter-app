'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Boxeador, Rutina } from '@/lib/types';
import { Plus, Edit, Trash2, Save, X, Upload, BarChart, Users, Activity } from 'lucide-react';

export default function AdminPage() {
  const [boxeadores, setBoxeadores] = useState<Boxeador[]>([]);
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('boxeadores');
  
  // Estados para formularios
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Boxeador | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    estilo: '',
    record: '',
    nacionalidad: '',
    peso: '',
    altura: '',
    biografia: '',
    titulos: '',
    imagen_url: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar boxeadores
      const { data: boxeadoresData } = await supabase
        .from('boxeadores')
        .select('*')
        .order('nombre');
      
      // Cargar rutinas
      const { data: rutinasData } = await supabase
        .from('rutinas')
        .select('*')
        .order('boxeador_id')
        .order('round');
      
      setBoxeadores(boxeadoresData || []);
      setRutinas(rutinasData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editing) {
        // Actualizar
        const { error } = await supabase
          .from('boxeadores')
          .update(formData)
          .eq('id', editing.id);
        
        if (error) throw error;
      } else {
        // Crear nuevo
        const { error } = await supabase
          .from('boxeadores')
          .insert([formData]);
        
        if (error) throw error;
      }
      
      await cargarDatos();
      resetForm();
      alert(editing ? 'Boxeador actualizado' : 'Boxeador creado');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este boxeador y todas sus rutinas?')) return;
    
    try {
      // Primero eliminar rutinas
      await supabase
        .from('rutinas')
        .delete()
        .eq('boxeador_id', id);
      
      // Luego eliminar boxeador
      const { error } = await supabase
        .from('boxeadores')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await cargarDatos();
      alert('Boxeador eliminado');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      estilo: '',
      record: '',
      nacionalidad: '',
      peso: '',
      altura: '',
      biografia: '',
      titulos: '',
      imagen_url: ''
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (boxeador: Boxeador) => {
    setFormData({
      nombre: boxeador.nombre,
      estilo: boxeador.estilo || '',
      record: boxeador.record || '',
      nacionalidad: boxeador.nacionalidad || '',
      peso: boxeador.peso || '',
      altura: boxeador.altura || '',
      biografia: boxeador.biografia || '',
      titulos: boxeador.titulos || '',
      imagen_url: boxeador.imagen_url || ''
    });
    setEditing(boxeador);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p>Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            PANEL DE <span className="text-yellow-500">ADMINISTRACIÓN</span>
          </h1>
          <p className="text-gray-400">Gestiona boxeadores, rutinas y estadísticas</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">{boxeadores.length}</div>
                <div className="text-gray-400">Boxeadores</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Activity className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">{rutinas.length}</div>
                <div className="text-gray-400">Rutinas</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <BarChart className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {rutinas.length > 0 ? Math.round(rutinas.reduce((sum, r) => sum + r.duracion_segundos, 0) / 60) : 0}
                </div>
                <div className="text-gray-400">Minutos de entrenamiento</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('boxeadores')}
              className={`px-6 py-3 font-bold border-b-2 transition ${
                activeTab === 'boxeadores'
                  ? 'border-yellow-500 text-yellow-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              BOXEADORES
            </button>
            <button
              onClick={() => setActiveTab('rutinas')}
              className={`px-6 py-3 font-bold border-b-2 transition ${
                activeTab === 'rutinas'
                  ? 'border-yellow-500 text-yellow-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              RUTINAS
            </button>
            <button
              onClick={() => setActiveTab('estadisticas')}
              className={`px-6 py-3 font-bold border-b-2 transition ${
                activeTab === 'estadisticas'
                  ? 'border-yellow-500 text-yellow-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              ESTADÍSTICAS
            </button>
          </div>
        </div>

        {/* Contenido de Tabs */}
        <div className="bg-gray-800/30 rounded-2xl border border-gray-700 p-6">
          {activeTab === 'boxeadores' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">GESTIÓN DE BOXEADORES</h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-black font-bold rounded-xl hover:bg-yellow-500"
                >
                  <Plus className="w-5 h-5" />
                  NUEVO BOXEADOR
                </button>
              </div>

              {/* Formulario */}
              {showForm && (
                <div className="mb-8 p-6 bg-gray-900/50 rounded-2xl border border-gray-700">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">
                      {editing ? 'EDITAR BOXEADOR' : 'NUEVO BOXEADOR'}
                    </h3>
                    <button
                      onClick={resetForm}
                      className="p-2 hover:bg-gray-800 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">Nombre *</label>
                        <input
                          type="text"
                          required
                          value={formData.nombre}
                          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500"
                          placeholder="Ej: Muhammad Ali"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Estilo</label>
                        <input
                          type="text"
                          value={formData.estilo}
                          onChange={(e) => setFormData({...formData, estilo: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500"
                          placeholder="Ej: Estilo de baile"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Récord</label>
                        <input
                          type="text"
                          value={formData.record}
                          onChange={(e) => setFormData({...formData, record: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500"
                          placeholder="Ej: 56-5-0 (37 KO)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Nacionalidad</label>
                        <input
                          type="text"
                          value={formData.nacionalidad}
                          onChange={(e) => setFormData({...formData, nacionalidad: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500"
                          placeholder="Ej: Estados Unidos"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Peso</label>
                        <input
                          type="text"
                          value={formData.peso}
                          onChange={(e) => setFormData({...formData, peso: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500"
                          placeholder="Ej: Pesado (91-100 kg)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Altura</label>
                        <input
                          type="text"
                          value={formData.altura}
                          onChange={(e) => setFormData({...formData, altura: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500"
                          placeholder="Ej: 1.91 m"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Títulos</label>
                      <input
                        type="text"
                        value={formData.titulos}
                        onChange={(e) => setFormData({...formData, titulos: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500"
                        placeholder="Ej: Campeón Mundial de los Pesados"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Biografía</label>
                      <textarea
                        value={formData.biografia}
                        onChange={(e) => setFormData({...formData, biografia: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500"
                        placeholder="Descripción del boxeador..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">URL de Imagen</label>
                      <input
                        type="text"
                        value={formData.imagen_url}
                        onChange={(e) => setFormData({...formData, imagen_url: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500"
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold"
                      >
                        CANCELAR
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-xl"
                      >
                        <Save className="w-5 h-5" />
                        {editing ? 'ACTUALIZAR' : 'GUARDAR'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Lista de Boxeadores */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4">NOMBRE</th>
                      <th className="text-left py-3 px-4">ESTILO</th>
                      <th className="text-left py-3 px-4">RÉCORD</th>
                      <th className="text-left py-3 px-4">PAÍS</th>
                      <th className="text-left py-3 px-4">RUTINAS</th>
                      <th className="text-left py-3 px-4">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boxeadores.map((boxeador) => {
                      const rutinasBoxeador = rutinas.filter(r => r.boxeador_id === boxeador.id);
                      return (
                        <tr key={boxeador.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="py-4 px-4">
                            <div className="font-bold">{boxeador.nombre}</div>
                            <div className="text-sm text-gray-400">{boxeador.peso}</div>
                          </td>
                          <td className="py-4 px-4">{boxeador.estilo}</td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                              {boxeador.record}
                            </span>
                          </td>
                          <td className="py-4 px-4">{boxeador.nacionalidad}</td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                              {rutinasBoxeador.length} ejercicios
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(boxeador)}
                                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(boxeador.id)}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'rutinas' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">GESTIÓN DE RUTINAS</h2>
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🥊</div>
                <h3 className="text-xl font-bold mb-4">PRÓXIMAMENTE</h3>
                <p className="text-gray-400">
                  El editor de rutinas estará disponible en la próxima actualización.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'estadisticas' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">ESTADÍSTICAS DEL SISTEMA</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-4">DISTRIBUCIÓN POR ESTILO</h3>
                  <div className="space-y-4">
                    {Object.entries(
                      boxeadores.reduce((acc, b) => {
                        acc[b.estilo || 'No especificado'] = (acc[b.estilo || 'No especificado'] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([estilo, count]) => (
                      <div key={estilo} className="flex items-center justify-between">
                        <span>{estilo}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-500 rounded-full"
                              style={{ width: `${(count / boxeadores.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="font-bold">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-900/50 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-4">RUTINAS POR NIVEL</h3>
                  <div className="space-y-4">
                    {Object.entries(
                      rutinas.reduce((acc, r) => {
                        acc[r.nivel] = (acc[r.nivel] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([nivel, count]) => (
                      <div key={nivel} className="flex items-center justify-between">
                        <span className="capitalize">{nivel}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${(count / rutinas.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="font-bold">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}