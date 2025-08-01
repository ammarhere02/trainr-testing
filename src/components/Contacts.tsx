import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Tag, 
  Upload, 
  Download, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Users, 
  TrendingUp, 
  Eye, 
  X, 
  Check, 
  AlertCircle, 
  FileText, 
  Building, 
  Globe, 
  MessageCircle, 
  Star, 
  Activity,
  UserPlus,
  Import,
  ExternalLink,
  Copy,
  Send
} from 'lucide-react';

export default function Contacts() {
  const [activeTab, setActiveTab] = useState('all-contacts');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<'single' | 'csv'>('single');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [showCsvPreview, setShowCsvPreview] = useState(false);

  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    tags: '',
    notes: '',
    source: 'manual',
    emailMarketing: true
  });

  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('contacts-data');
    return saved ? JSON.parse(saved) : [
    {
      id: 1,
      firstName: 'Jack',
      lastName: 'Malik',
      email: 'allanknight2020@hotmail.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Startup Inc.',
      position: 'CEO',
      website: 'https://techstartup.com',
      address: '123 Main St',
      city: 'San Francisco',
      country: 'USA',
      tags: ['customer', 'vip'],
      emailMarketing: false,
      lifetimeValue: 0.00,
      addedDate: '2025-07-15',
      lastActivity: null,
      source: 'website',
      notes: 'Interested in premium features',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50'
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 987-6543',
      company: 'Design Agency',
      position: 'Creative Director',
      website: 'https://designagency.com',
      address: '456 Oak Ave',
      city: 'New York',
      country: 'USA',
      tags: ['lead', 'designer'],
      emailMarketing: true,
      lifetimeValue: 2500.00,
      addedDate: '2025-07-10',
      lastActivity: '2025-07-14',
      source: 'referral',
      notes: 'Completed web development course',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50'
    },
    {
      id: 3,
      firstName: 'Mike',
      lastName: 'Chen',
      email: 'mike@example.com',
      phone: '+1 (555) 456-7890',
      company: 'Freelancer',
      position: 'Web Developer',
      website: 'https://mikechen.dev',
      address: '789 Pine St',
      city: 'Austin',
      country: 'USA',
      tags: ['student', 'developer'],
      emailMarketing: true,
      lifetimeValue: 199.00,
      addedDate: '2025-07-05',
      lastActivity: '2025-07-13',
      source: 'social-media',
      notes: 'Active in community discussions',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50'
    }
  ]});

  const [tags, setTags] = useState([
    { id: 1, name: 'customer', color: 'bg-green-100 text-green-700', count: 1 },
    { id: 2, name: 'lead', color: 'bg-blue-100 text-blue-700', count: 1 },
    { id: 3, name: 'student', color: 'bg-purple-100 text-purple-700', count: 1 },
    { id: 4, name: 'vip', color: 'bg-yellow-100 text-yellow-700', count: 1 },
    { id: 5, name: 'designer', color: 'bg-pink-100 text-pink-700', count: 1 },
    { id: 6, name: 'developer', color: 'bg-indigo-100 text-indigo-700', count: 1 }
  ]);

  const segments = [
    { id: 'all', name: 'All Contacts', count: contacts.length },
    { id: 'subscribed', name: 'Email Subscribers', count: contacts.filter(c => c.emailMarketing).length },
    { id: 'customers', name: 'Customers', count: contacts.filter(c => c.lifetimeValue > 0).length },
    { id: 'leads', name: 'Leads', count: contacts.filter(c => c.lifetimeValue === 0).length },
    { id: 'recent', name: 'Added This Week', count: contacts.filter(c => new Date(c.addedDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length }
  ];

  // Filter contacts based on search, segment, etc.
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSegment = selectedSegment === 'all' ||
      (selectedSegment === 'subscribed' && contact.emailMarketing) ||
      (selectedSegment === 'customers' && contact.lifetimeValue > 0) ||
      (selectedSegment === 'leads' && contact.lifetimeValue === 0) ||
      (selectedSegment === 'recent' && new Date(contact.addedDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

    return matchesSearch && matchesSegment;
  });

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + itemsPerPage);

  const handleAddContact = () => {
    const contactData = {
      id: Date.now(),
      firstName: newContact.firstName,
      lastName: newContact.lastName,
      email: newContact.email,
      phone: newContact.phone,
      company: newContact.company,
      position: newContact.position,
      tags: newContact.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      emailMarketing: newContact.emailMarketing,
      lifetimeValue: 0,
      addedDate: new Date().toISOString().split('T')[0],
      source: newContact.source,
      notes: newContact.notes,
      avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=50`
    };

    const updatedContacts = [contactData, ...contacts];
    setContacts(updatedContacts);
    localStorage.setItem('contacts-data', JSON.stringify(updatedContacts));
    setShowAddModal(false);
    setNewContact({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      tags: '',
      notes: '',
      source: 'manual',
      emailMarketing: true
    });
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      
      // Parse CSV for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const preview = lines.slice(1, 6).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index] || '';
          });
          return obj;
        }).filter(row => Object.values(row).some(val => val));
        
        setCsvPreview(preview);
        setShowCsvPreview(true);
      };
      reader.readAsText(file);
    }
  };

  const handleCsvImport = () => {
    if (!csvFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const newContacts = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        const contact: any = {
          id: Date.now() + index,
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          position: '',
          website: '',
          address: '',
          city: '',
          country: '',
          tags: [],
          emailMarketing: true,
          lifetimeValue: 0,
          addedDate: new Date().toISOString().split('T')[0],
          lastActivity: null,
          source: 'csv-import',
          notes: '',
          avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=50`
        };

        headers.forEach((header, i) => {
          const value = values[i] || '';
          switch (header) {
            case 'first name':
            case 'firstname':
              contact.firstName = value;
              break;
            case 'last name':
            case 'lastname':
              contact.lastName = value;
              break;
            case 'email':
              contact.email = value;
              break;
            case 'phone':
              contact.phone = value;
              break;
            case 'company':
              contact.company = value;
              break;
            case 'position':
            case 'title':
              contact.position = value;
              break;
            case 'tags':
              contact.tags = value.split(';').map((t: string) => t.trim()).filter((t: string) => t);
              break;
          }
        });

        return contact;
      }).filter(contact => contact.email); // Only import contacts with email

      const updatedContacts = [...newContacts, ...contacts];
      setContacts(updatedContacts);
      localStorage.setItem('contacts-data', JSON.stringify(updatedContacts));
      setShowAddModal(false);
      setCsvFile(null);
      setCsvPreview([]);
      setShowCsvPreview(false);
    };
    reader.readAsText(csvFile);
  };

  const handleDeleteContact = (contactId: number) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      const updatedContacts = contacts.filter(c => c.id !== contactId);
      setContacts(updatedContacts);
      localStorage.setItem('contacts-data', JSON.stringify(updatedContacts));
    }
  };

  const handleSelectContact = (contactId: number) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === paginatedContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(paginatedContacts.map(c => c.id));
    }
  };

  const getTagColor = (tagName: string) => {
    const tag = tags.find(t => t.name === tagName);
    return tag ? tag.color : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs text-gray-600">?</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add contacts
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all-contacts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'all-contacts'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Contacts
          </button>
          <button
            onClick={() => setActiveTab('manage-tags')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'manage-tags'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage tags
          </button>
        </nav>
      </div>

      {/* All Contacts Tab */}
      {activeTab === 'all-contacts' && (
        <div className="space-y-6">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <select
                    value={selectedSegment}
                    onChange={(e) => setSelectedSegment(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">Segments</option>
                    {segments.map((segment) => (
                      <option key={segment.id} value={segment.id}>
                        {segment.name} ({segment.count})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search Contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Displaying {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredContacts.length)} of {filteredContacts.length} contacts
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="name">Sort</option>
                <option value="email">Email</option>
                <option value="date">Date Added</option>
                <option value="value">Lifetime Value</option>
              </select>
            </div>
          </div>

          {/* Contacts Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-white border-b border-gray-200">
              <div className="px-6 py-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedContacts.length === paginatedContacts.length && paginatedContacts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded mr-6"
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-5 text-sm font-medium text-gray-500 uppercase tracking-wide">
                    <div className="w-64">NAME</div>
                    <div className="w-64">EMAIL</div>
                    <div className="w-48 text-center">EMAIL MARKETING</div>
                    <div className="w-40 text-right">LIFETIME VALUE</div>
                    <div className="w-32 text-right">ADDED DATE</div>
                  </div>
                  <div className="w-24"></div> {/* Space for action buttons */}
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {paginatedContacts.map((contact) => (
                <div key={contact.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => handleSelectContact(contact.id)}
                      className="rounded mr-6"
                    />
                    <div className="flex-1 grid grid-cols-5 items-center">
                      {/* Name */}
                      <div className="w-64 flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {contact.firstName} {contact.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{contact.company}</div>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="w-64">
                        <div className="text-sm text-gray-900">{contact.email}</div>
                        <div className="text-sm text-gray-500">{contact.phone}</div>
                      </div>

                      {/* Email Marketing */}
                      <div className="w-48 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          contact.emailMarketing 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {contact.emailMarketing ? 'Subscribed' : 'Never subscribed'}
                        </span>
                      </div>

                      {/* Lifetime Value */}
                      <div className="w-40 text-sm text-gray-900 font-medium text-right">
                        ${contact.lifetimeValue.toFixed(2)}
                      </div>

                      {/* Added Date */}
                      <div className="w-32 text-sm text-gray-900 text-right">
                        {new Date(contact.addedDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="w-24 flex items-center justify-end space-x-1">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteContact(contact.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Footer Link */}
          <div className="text-center mt-8">
            <a href="#" className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center justify-center">
              Learn more about Contacts
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      )}

      {/* Manage Tags Tab */}
      {activeTab === 'manage-tags' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Manage Tags</h2>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Add Tag
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${tag.color}`}>
                      {tag.name}
                    </span>
                    <span className="text-sm text-gray-600">{tag.count} contacts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Add Contacts</h3>
              
              {/* Mode Selection */}
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setAddMode('single')}
                  className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                    addMode === 'single' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <UserPlus className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-medium text-gray-900">Add Single Contact</h4>
                  <p className="text-sm text-gray-600">Manually add one contact</p>
                </button>
                <button
                  onClick={() => setAddMode('csv')}
                  className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                    addMode === 'csv' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Import className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-medium text-gray-900">Upload CSV</h4>
                  <p className="text-sm text-gray-600">Import multiple contacts</p>
                </button>
              </div>

              {/* Single Contact Form */}
              {addMode === 'single' && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={newContact.firstName}
                        onChange={(e) => setNewContact({...newContact, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={newContact.lastName}
                        onChange={(e) => setNewContact({...newContact, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={newContact.email}
                        onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={newContact.company}
                        onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        value={newContact.position}
                        onChange={(e) => setNewContact({...newContact, position: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={newContact.tags}
                        onChange={(e) => setNewContact({...newContact, tags: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="customer, lead, vip"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        rows={2}
                        value={newContact.notes}
                        onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        placeholder="Additional notes..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Subscribe to email marketing</span>
                    <input
                      type="checkbox"
                      checked={newContact.emailMarketing}
                      onChange={(e) => setNewContact({...newContact, emailMarketing: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                </div>
              )}

              {/* CSV Upload */}
              {addMode === 'csv' && (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Upload CSV File</h4>
                    <p className="text-gray-600 mb-4">
                      Upload a CSV file with your contacts. Make sure to include headers.
                    </p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label
                      htmlFor="csv-upload"
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer inline-block"
                    >
                      Choose CSV File
                    </label>
                  </div>

                  {csvFile && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">File selected: {csvFile.name}</span>
                      </div>
                    </div>
                  )}

                  {showCsvPreview && csvPreview.length > 0 && (
                    <div className="space-y-4">
                      <h5 className="font-medium text-gray-900">Preview (first 5 rows):</h5>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              {Object.keys(csvPreview[0]).map((header) => (
                                <th key={header} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {csvPreview.map((row, index) => (
                              <tr key={index}>
                                {Object.values(row).map((value: any, i) => (
                                  <td key={i} className="px-4 py-2 text-sm text-gray-900">
                                    {value}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-2">CSV Format Requirements:</h5>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Include headers in the first row</li>
                      <li>• Supported columns: First Name, Last Name, Email, Phone, Company, Position, Tags</li>
                      <li>• Email is required for each contact</li>
                      <li>• Separate multiple tags with semicolons (;)</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setCsvFile(null);
                    setCsvPreview([]);
                    setShowCsvPreview(false);
                    setNewContact({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      company: '',
                      position: '',
                      tags: '',
                      notes: '',
                      source: 'manual',
                      emailMarketing: true
                    });
                  }}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addMode === 'single' ? handleAddContact : handleCsvImport}
                  disabled={
                    addMode === 'single' 
                      ? !newContact.firstName || !newContact.lastName || !newContact.email
                      : !csvFile
                  }
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addMode === 'single' ? 'Add Contact' : 'Import Contacts'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}