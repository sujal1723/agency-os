

import { useState, useEffect } from 'react'

import { supabase } from './supabase'

import Auth from './Auth'

import {

  LayoutDashboard, Users, FolderKanban, Target, Settings, ListTodo,

  Search, Bell, Sun, Moon, Plus, ArrowUpRight, ArrowDownRight,

  MoreHorizontal, Menu, X, ChevronDown, Briefcase,

  CircleDollarSign, CheckCircle2, Clock, TrendingUp,

  Mail, Phone, CalendarDays, Filter, Eye, Trash2,

  Zap, Sparkles, LogOut, FileText

} from 'lucide-react'



const initialClients = [

  { id: 1, name: 'Nova Digital', email: 'hello@novadigital.com', company: 'Marketing', status: 'Active', date: 'Nov 10, 2026', color: '#8B5CF6' },

  { id: 2, name: 'Pixel Studio', email: 'team@pixelstudio.com', company: 'Design', status: 'Active', date: 'Nov 08, 2026', color: '#0EA5E9' },

  { id: 3, name: 'Urban Nest', email: 'contact@urbannest.com', company: 'Real Estate', status: 'Pending', date: 'Nov 06, 2026', color: '#F59E0B' },

  { id: 4, name: 'Growth Labs', email: 'info@growthlabs.com', company: 'Technology', status: 'Active', date: 'Nov 03, 2026', color: '#10B981' },

  { id: 5, name: 'Luxe Living', email: 'hello@luxeliving.com', company: 'Lifestyle', status: 'Inactive', date: 'Oct 29, 2026', color: '#EC4899' },

]



const initialProjects = [

  { id: 1, name: 'Brand Identity Design', client: 'Nova Digital', progress: 85, status: 'In Progress', due: 'Nov 18, 2026', color: '#8B5CF6' },

  { id: 2, name: 'Website Redesign', client: 'Pixel Studio', progress: 65, status: 'In Progress', due: 'Nov 22, 2026', color: '#0EA5E9' },

  { id: 3, name: 'Social Media Campaign', client: 'Urban Nest', progress: 35, status: 'In Progress', due: 'Nov 25, 2026', color: '#F59E0B' },

  { id: 4, name: 'SEO Optimization', client: 'Growth Labs', progress: 100, status: 'Completed', due: 'Nov 08, 2026', color: '#10B981' },

]



const initialLeads = [

  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', service: 'Website Development', status: 'New', date: 'Today' },

  { id: 2, name: 'Priya Mehta', email: 'priya@example.com', service: 'Digital Marketing', status: 'Contacted', date: 'Yesterday' },

  { id: 3, name: 'Aman Verma', email: 'aman@example.com', service: 'Brand Identity', status: 'Converted', date: 'Nov 10' },

  { id: 4, name: 'Sneha Patel', email: 'sneha@example.com', service: 'SEO Services', status: 'New', date: 'Nov 09' },

]



const navItems = [

  { label: 'Overview', icon: LayoutDashboard },

  { label: 'Clients', icon: Users },

  { label: 'Projects', icon: FolderKanban },

  { label: 'Leads', icon: Target },
  { label: 'Tasks', icon: ListTodo },

]



const money = (value) => '₹' + value.toLocaleString('en-IN')



function Avatar({ name, color = '#8B5CF6', size = 'w-9 h-9' }) {

  return (

    <div

      className={`${size} rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0`}

      style={{ background: color }}

    >

      {name.split(' ').map(word => word[0]).slice(0, 2).join('')}

    </div>

  )

}



function Badge({ children }) {

  const styles = {

    Active: 'bg-emerald-500/10 text-emerald-500',

    Pending: 'bg-amber-500/10 text-amber-500',

    Inactive: 'bg-slate-500/10 text-slate-400',

    'In Progress': 'bg-blue-500/10 text-blue-500',

    Completed: 'bg-emerald-500/10 text-emerald-500',

    New: 'bg-violet-500/10 text-violet-500',

    Contacted: 'bg-blue-500/10 text-blue-500',

    Converted: 'bg-emerald-500/10 text-emerald-500',

  }

  return (

    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${styles[children] || 'bg-slate-500/10 text-slate-400'}`}>

      {children}

    </span>

  )

}



function Modal({ title, onClose, children }) {

  return (

    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="w-full max-w-md rounded-2xl border p-6 shadow-2xl bg-white dark:bg-[#151923] border-slate-200 dark:border-white/10">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-xl font-bold">{title}</h2>

          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">

            <X size={19} />

          </button>

        </div>

        {children}

      </div>

    </div>

  )

}



function Dashboard() {

  const [dark, setDark] = useState(true)

  const [active, setActive] = useState('Overview')

  const [mobileMenu, setMobileMenu] = useState(false)

  const [search, setSearch] = useState('')

  const [modal, setModal] = useState('')

  const [clients, setClients] = useState([])
  const [clientsLoading, setClientsLoading] = useState(true)

  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [editingProject, setEditingProject] = useState(null)

  const [leads, setLeads] = useState([])
  const [leadsLoading, setLeadsLoading] = useState(true)
  const [editingLead, setEditingLead] = useState(null)

  const [tasks, setTasks] = useState([])
  const [tasksLoading, setTasksLoading] = useState(true)
  const [editingTask, setEditingTask] = useState(null)

  const [clientForm, setClientForm] = useState({ name: '', email: '', company: '' })

  const [editingClient, setEditingClient] = useState(null)

  const [projectForm, setProjectForm] = useState({ name: '', clientId: '', due: '', budget: '', progress: 0, status: 'In Progress' })
  const [leadForm, setLeadForm] = useState({ name: '', email: '', company: '', service: '' })
  const [taskForm, setTaskForm] = useState({ title: '', projectId: '', dueDate: '' })

  const [notification, setNotification] = useState('')
  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)

  useEffect(() => {
    async function fetchClients() {
      setClientsLoading(true)

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading clients:', error.message)
        notify('Could not load clients: ' + error.message)
      } else {
        const formattedClients = (data || []).map(client => ({
          id: client.id,
          name: client.name,
          email: client.email || '',
          company: client.company || '',
          status: client.status || 'Active',
          date: client.created_at
            ? new Date(client.created_at).toLocaleDateString()
            : '',
          color: '#8B5CF6'
        }))

        setClients(formattedClients)
      }

      setClientsLoading(false)
    }

    fetchClients()
  }, [])

  // LOAD PROJECTS FROM SUPABASE
  useEffect(() => {
    async function fetchProjects() {
      setProjectsLoading(true)

      const { data, error } = await supabase
        .from('projects')
        .select('*, clients(name)')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading projects:', error.message)
        notify('Could not load projects: ' + error.message)
      } else {
        setProjects((data || []).map(project => ({
          id: project.id,
          name: project.name,
          client: project.clients?.name || 'No client assigned',
          clientId: project.client_id || '',
          progress: Number(project.progress ?? 0),
          status: project.status || 'In Progress',
          due: project.deadline || '',
          budget: Number(project.budget || 0),
          createdAt: project.created_at || null,
          color: '#8B5CF6'
        })))
      }

      setProjectsLoading(false)
    }

    fetchProjects()
  }, [])




  // LOAD LEADS FROM SUPABASE
  useEffect(() => {
    async function fetchLeads() {
      setLeadsLoading(true)

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading leads:', error.message)
        notify('Could not load leads: ' + error.message)
      } else {
        setLeads((data || []).map(lead => ({
          id: lead.id,
          name: lead.name,
          email: lead.email || '',
          company: lead.company || '',
          service: lead.source || '',
          status: lead.status || 'New',
          date: lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '',
          createdAt: lead.created_at || null
        })))
      }

      setLeadsLoading(false)
    }

    fetchLeads()
  }, [])

  // LOAD TASKS FROM SUPABASE
  useEffect(() => {
    async function fetchTasks() {
      setTasksLoading(true)
      const { data, error } = await supabase
        .from('tasks')
        .select('*, projects(name)')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading tasks:', error.message)
        notify('Could not load tasks: ' + error.message)
      } else {
        setTasks((data || []).map(task => ({
          id: task.id,
          title: task.title,
          projectId: task.project_id || '',
          project: task.projects?.name || 'No project assigned',
          completed: Boolean(task.completed),
          dueDate: task.due_date || '',
          createdAt: task.created_at || null
        })))
      }
      setTasksLoading(false)
    }
    fetchTasks()
  }, [])

  const notify = (message) => {

    setNotification(message)

    setTimeout(() => setNotification(''), 2500)

  }



  const addClient = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase
      .from('clients')
      .insert([
        {
          name: clientForm.name.trim(),
          email: clientForm.email.trim(),
          company: clientForm.company.trim(),
          status: 'Active'
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error adding client:', error.message)
      notify('Could not add client: ' + error.message)
      return
    }

    const newClient = {
      id: data.id,
      name: data.name,
      email: data.email || '',
      company: data.company || '',
      status: data.status || 'Active',
      date: data.created_at
        ? new Date(data.created_at).toLocaleDateString()
        : '',
      color: '#8B5CF6'
    }

    setClients(previous => [newClient, ...previous])
    setClientForm({ name: '', email: '', company: '' })
    setModal('')
    notify('Client saved successfully!')
  }

  const updateClient = async (e) => {
    e.preventDefault()

    if (!editingClient) return

    const { data, error } = await supabase
      .from('clients')
      .update({
        name: clientForm.name.trim(),
        email: clientForm.email.trim(),
        company: clientForm.company.trim()
      })
      .eq('id', editingClient.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating client:', error.message)
      notify('Could not update client: ' + error.message)
      return
    }

    setClients(previous => previous.map(client =>
      client.id === editingClient.id
        ? {
            ...client,
            name: data.name,
            email: data.email || '',
            company: data.company || ''
          }
        : client
    ))

    setEditingClient(null)
    setClientForm({ name: '', email: '', company: '' })
    setModal('')
    notify('Client updated successfully!')
  }



  const addProject = async (e) => {
    e.preventDefault()

    const selectedClient = clients.find(client => client.id === projectForm.clientId)

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        name: projectForm.name.trim(),
        client_id: projectForm.clientId || null,
        description: '',
        status: projectForm.status,
        budget: Number(projectForm.budget || 0),
        deadline: projectForm.due || null,
        progress: Number(projectForm.progress || 0)
      }])
      .select('*, clients(name)')
      .single()

    if (error) {
      console.error('Error creating project:', error.message)
      notify('Could not create project: ' + error.message)
      return
    }

    const newProject = {
      id: data.id,
      name: data.name,
      client: data.clients?.name || selectedClient?.name || 'No client assigned',
      clientId: data.client_id || '',
      progress: Number(data.progress ?? 0),
      status: data.status || 'In Progress',
      due: data.deadline || '',
      budget: Number(data.budget || 0),
      color: '#8B5CF6'
    }

    setProjects(previous => [newProject, ...previous])
    setProjectForm({ name: '', clientId: '', due: '', budget: '', progress: 0, status: 'In Progress' })
    setModal('')
    notify('Project saved successfully!')
  }

  const updateProject = async (e) => {
    e.preventDefault()
    if (!editingProject) return

    const selectedClient = clients.find(client => client.id === projectForm.clientId)

    const { data, error } = await supabase
      .from('projects')
      .update({
        name: projectForm.name.trim(),
        client_id: projectForm.clientId || null,
        budget: Number(projectForm.budget || 0),
        deadline: projectForm.due || null,
        progress: Number(projectForm.progress || 0),
        status: projectForm.status
      })
      .eq('id', editingProject.id)
      .select('*, clients(name)')
      .single()

    if (error) {
      console.error('Error updating project:', error.message)
      notify('Could not update project: ' + error.message)
      return
    }

    const updatedProject = {
      id: data.id,
      name: data.name,
      client: data.clients?.name || selectedClient?.name || 'No client assigned',
      clientId: data.client_id || '',
      progress: Number(data.progress ?? 0),
      status: data.status || 'In Progress',
      due: data.deadline || '',
      budget: Number(data.budget || 0),
      color: editingProject.color || '#8B5CF6'
    }

    setProjects(previous => previous.map(project =>
      project.id === editingProject.id ? updatedProject : project
    ))
    setEditingProject(null)
    setProjectForm({ name: '', clientId: '', due: '', budget: '', progress: 0, status: 'In Progress' })
    setModal('')
    notify('Project updated successfully!')
  }



  const addLead = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase
      .from('leads')
      .insert([{
        name: leadForm.name.trim(),
        email: leadForm.email.trim(),
        company: leadForm.company.trim(),
        source: leadForm.service.trim(),
        status: 'New'
      }])
      .select()
      .single()

    if (error) {
      console.error('Error adding lead:', error.message)
      notify('Could not add lead: ' + error.message)
      return
    }

    const newLead = {
      id: data.id,
      name: data.name,
      email: data.email || '',
      company: data.company || '',
      service: data.source || '',
      status: data.status || 'New',
      date: data.created_at ? new Date(data.created_at).toLocaleDateString() : ''
    }

    setLeads(previous => [newLead, ...previous])
    setLeadForm({ name: '', email: '', company: '', service: '' })
    setModal('')
    notify('Lead added successfully!')
  }

  const updateLead = async (e) => {
    e.preventDefault()
    if (!editingLead) return

    const { data, error } = await supabase
      .from('leads')
      .update({
        name: leadForm.name.trim(),
        email: leadForm.email.trim(),
        company: leadForm.company.trim(),
        source: leadForm.service.trim()
      })
      .eq('id', editingLead.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating lead:', error.message)
      notify('Could not update lead: ' + error.message)
      return
    }

    setLeads(previous => previous.map(lead => lead.id === editingLead.id ? {
      ...lead,
      name: data.name,
      email: data.email || '',
      company: data.company || '',
      service: data.source || ''
    } : lead))

    setEditingLead(null)
    setLeadForm({ name: '', email: '', company: '', service: '' })
    setModal('')
    notify('Lead updated successfully!')
  }

  const changeLeadStatus = async (id, status) => {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Error updating lead status:', error.message)
      notify('Could not update lead: ' + error.message)
      return
    }

    setLeads(previous => previous.map(lead => lead.id === id ? { ...lead, status } : lead))
    notify('Lead status updated!')
  }

  const removeLead = async (id) => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting lead:', error.message)
      notify('Could not delete lead: ' + error.message)
      return
    }

    setLeads(previous => previous.filter(lead => lead.id !== id))
    notify('Lead deleted successfully!')
  }



  const addTask = async (e) => {
    e.preventDefault()
    const selectedProject = projects.find(project => project.id === taskForm.projectId)
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title: taskForm.title.trim(),
        project_id: taskForm.projectId || null,
        due_date: taskForm.dueDate || null,
        completed: false
      }])
      .select('*, projects(name)')
      .single()

    if (error) {
      console.error('Error creating task:', error.message)
      notify('Could not create task: ' + error.message)
      return
    }
    const newTask = {
      id: data.id,
      title: data.title,
      projectId: data.project_id || '',
      project: data.projects?.name || selectedProject?.name || 'No project assigned',
      completed: Boolean(data.completed),
      dueDate: data.due_date || '',
      createdAt: data.created_at || null
    }
    setTasks(previous => [newTask, ...previous])
    setTaskForm({ title: '', projectId: '', dueDate: '' })
    setModal('')
    notify('Task created successfully!')
  }

  const updateTask = async (e) => {
    e.preventDefault()
    if (!editingTask) return
    const selectedProject = projects.find(project => project.id === taskForm.projectId)
    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: taskForm.title.trim(),
        project_id: taskForm.projectId || null,
        due_date: taskForm.dueDate || null
      })
      .eq('id', editingTask.id)
      .select('*, projects(name)')
      .single()

    if (error) {
      console.error('Error updating task:', error.message)
      notify('Could not update task: ' + error.message)
      return
    }
    setTasks(previous => previous.map(task => task.id === editingTask.id ? {
      ...task,
      title: data.title,
      projectId: data.project_id || '',
      project: data.projects?.name || selectedProject?.name || 'No project assigned',
      dueDate: data.due_date || ''
    } : task))
    setEditingTask(null)
    setTaskForm({ title: '', projectId: '', dueDate: '' })
    setModal('')
    notify('Task updated successfully!')
  }

  const toggleTask = async (task) => {
    const nextCompleted = !task.completed
    const { error } = await supabase
      .from('tasks')
      .update({ completed: nextCompleted })
      .eq('id', task.id)
    if (error) {
      console.error('Error updating task:', error.message)
      notify('Could not update task: ' + error.message)
      return
    }
    setTasks(previous => previous.map(item => item.id === task.id ? { ...item, completed: nextCompleted } : item))
    notify(nextCompleted ? 'Task completed!' : 'Task reopened!')
  }

  const removeTask = async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) {
      console.error('Error deleting task:', error.message)
      notify('Could not delete task: ' + error.message)
      return
    }
    setTasks(previous => previous.filter(task => task.id !== id))
    notify('Task deleted successfully!')
  }

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Could not load profile:', error.message)
        return
      }
      setProfileEmail(data.user?.email || '')
      setProfileName(data.user?.user_metadata?.full_name || data.user?.user_metadata?.name || '')
    }
    loadProfile()
  }, [])

  const saveProfile = async (e) => {
    e.preventDefault()
    setProfileSaving(true)
    const { error } = await supabase.auth.updateUser({
      data: { full_name: profileName.trim() }
    })
    setProfileSaving(false)
    if (error) {
      console.error('Profile update failed:', error.message)
      notify('Could not update profile: ' + error.message)
      return
    }
    notify('Profile updated successfully!')
  }

  const filteredTasks = tasks.filter(task =>
    `${task.title} ${task.project}`.toLowerCase().includes(search.toLowerCase())
  )

  const removeClient = async (id) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting client:', error.message)
      notify('Could not delete client: ' + error.message)
      return
    }

    setClients(previous => previous.filter(client => client.id !== id))
    notify('Client deleted successfully!')
  }


  const removeProject = async (id) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project:', error.message)
      notify('Could not delete project: ' + error.message)
      return
    }

    setProjects(previous => previous.filter(project => project.id !== id))
    notify('Project deleted successfully!')
  }



  const filteredClients = clients.filter(c =>

    `${c.name} ${c.email} ${c.company}`.toLowerCase().includes(search.toLowerCase())

  )

  const filteredProjects = projects.filter(p =>

    `${p.name} ${p.client}`.toLowerCase().includes(search.toLowerCase())

  )

  const filteredLeads = leads.filter(l =>

    `${l.name} ${l.email} ${l.company} ${l.service} ${l.status}`.toLowerCase().includes(search.toLowerCase())

  )



  const totalProjectBudget = projects.reduce((total, project) => total + (Number(project.budget) || 0), 0)
  const completedProjects = projects.filter(project => project.status === 'Completed').length
  const activeProjects = projects.filter(project => project.status !== 'Completed').length
  const convertedLeads = leads.filter(lead => lead.status === 'Converted').length
  const conversionRate = leads.length ? Math.round((convertedLeads / leads.length) * 100) : 0
  const overdueProjects = projects.filter(project => {
    if (!project.due || project.status === 'Completed') return false
    const deadline = new Date(`${project.due}T23:59:59`)
    return !Number.isNaN(deadline.getTime()) && deadline < new Date()
  }).length

  const currentYear = new Date().getFullYear()
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthlyProjectBudgets = monthLabels.map((label, monthIndex) => ({
    label,
    total: projects
      .filter(project => {
        if (!project.createdAt) return false
        const created = new Date(project.createdAt)
        return created.getFullYear() === currentYear && created.getMonth() === monthIndex
      })
      .reduce((sum, project) => sum + (Number(project.budget) || 0), 0)
  }))
  const maxMonthlyBudget = Math.max(...monthlyProjectBudgets.map(month => month.total), 1)
  const projectStatusCounts = [
    { label: 'In Progress', color: '#8B5CF6', count: projects.filter(project => project.status === 'In Progress').length },
    { label: 'Completed', color: '#10B981', count: completedProjects },
    { label: 'On Hold', color: '#F59E0B', count: projects.filter(project => project.status === 'On Hold').length }
  ]
  const leadStatusCounts = [
    { label: 'New', color: '#0EA5E9', count: leads.filter(lead => lead.status === 'New').length },
    { label: 'Contacted', color: '#8B5CF6', count: leads.filter(lead => lead.status === 'Contacted').length },
    { label: 'Converted', color: '#10B981', count: convertedLeads },
    { label: 'Lost', color: '#F43F5E', count: leads.filter(lead => lead.status === 'Lost').length }
  ]

  const stats = [
    { label: 'Total Clients', value: clients.length, detail: `${clients.filter(client => client.status === 'Active').length} active`, icon: Users, color: '#8B5CF6' },
    { label: 'Active Projects', value: activeProjects, detail: `${completedProjects} completed`, icon: FolderKanban, color: '#0EA5E9' },
    { label: 'Total Leads', value: leads.length, detail: `${conversionRate}% conversion rate`, icon: Target, color: '#F59E0B' },
    { label: 'Project Budget', value: money(totalProjectBudget), detail: 'Total across all projects', icon: CircleDollarSign, color: '#10B981' },
  ]


  const pageTitle = active === 'Overview' ? 'Dashboard Overview' : active



  return (

    <div className={dark ? 'dark' : ''}>

      <div className="min-h-screen bg-[#F5F6FA] dark:bg-[#0D111B] text-slate-800 dark:text-slate-100 transition-colors duration-300">



        {/* SIDEBAR */}

        <aside className={`fixed z-40 top-0 left-0 h-screen w-64 bg-white dark:bg-[#111622] border-r border-slate-200 dark:border-white/[0.06] flex flex-col transition-transform duration-300 ${mobileMenu ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

          <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-200 dark:border-white/[0.06]">

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">

              <Zap size={22} className="text-white" />

            </div>

            <div>

              <h1 className="text-xl font-extrabold tracking-tight">Agency<span className="text-violet-500">OS</span></h1>

              <p className="text-[10px] tracking-[2px] text-slate-400 uppercase">Workspace</p>

            </div>

            <button onClick={() => setMobileMenu(false)} className="ml-auto lg:hidden p-2">

              <X size={19} />

            </button>

          </div>



          <div className="px-4 pt-7">

            <p className="px-3 mb-3 text-[10px] uppercase tracking-[2px] font-bold text-slate-400">Workspace</p>

            <div className="space-y-1">

              {navItems.map(item => {

                const Icon = item.icon

                return (

                  <button

                    key={item.label}

                    onClick={() => { setActive(item.label); setSearch(''); setMobileMenu(false) }}

                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${active === item.label ? 'bg-violet-500/10 text-violet-500' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.04] dark:text-slate-400'}`}

                  >

                    <Icon size={19} />

                    {item.label}

                    {item.label === 'Leads' && <span className="ml-auto text-xs bg-violet-500 text-white rounded-full px-2 py-0.5">{leads.length}</span>}

                  </button>

                )

              })}

            </div>

          </div>



          <div className="px-4 pt-8">

            <p className="px-3 mb-3 text-[10px] uppercase tracking-[2px] font-bold text-slate-400">Management</p>

            <button onClick={() => { setActive('Settings'); setSearch(''); setMobileMenu(false) }} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.04]">

              <Settings size={19} /> Settings

            </button>

            <button onClick={() => { setActive('Reports'); setSearch(''); setMobileMenu(false) }} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.04]">

              <FileText size={19} /> Reports

            </button>

          </div>



          <div className="mt-auto p-4">

            <div className="rounded-2xl p-4 bg-gradient-to-br from-violet-600 to-indigo-700 text-white relative overflow-hidden">

              <Sparkles size={28} className="mb-3 opacity-90" />

              <p className="font-bold text-sm">Grow your agency</p>

              <p className="text-xs text-violet-100 mt-1 leading-relaxed">Manage clients and projects from one place.</p>

              <div className="absolute -right-6 -bottom-8 w-28 h-28 rounded-full border-[18px] border-white/10" />

            </div>

            <button onClick={() => supabase.auth.signOut()} className="w-full flex items-center gap-3 mt-4 px-3 py-3 text-sm text-slate-500 dark:text-slate-400 hover:text-red-500">

              <LogOut size={18} /> Sign out

            </button>

          </div>

        </aside>



        {mobileMenu && <div onClick={() => setMobileMenu(false)} className="fixed inset-0 bg-black/50 z-30 lg:hidden" />}



        {/* MAIN AREA */}

        <main className="lg:ml-64 min-h-screen">

          {/* TOP BAR */}

          <header className="sticky top-0 z-20 h-20 px-5 md:px-8 flex items-center justify-between bg-white/90 dark:bg-[#111622]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06]">

            <div className="flex items-center gap-3">

              <button onClick={() => setMobileMenu(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">

                <Menu size={21} />

              </button>

              <div>

                <h2 className="font-bold text-lg">{pageTitle}</h2>

                <p className="text-xs text-slate-400 hidden sm:block">Welcome back, Ansh 👋</p>

              </div>

            </div>



            <div className="flex items-center gap-2 md:gap-4">

              <div className="relative hidden sm:block">

                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input

                  value={search}

                  onChange={e => setSearch(e.target.value)}

                  placeholder="Search anything..."

                  className="w-48 md:w-64 pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-100 dark:bg-white/[0.05] border border-transparent focus:border-violet-500 outline-none"

                />

              </div>

              <button onClick={() => setDark(!dark)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-violet-500/10">

                {dark ? <Sun size={19} /> : <Moon size={19} />}

              </button>

              <button onClick={() => notify('You are all caught up!')} className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.05]">

                <Bell size={19} />

                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-500" />

              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/10">

                <Avatar name="Ansh Kumar" color="#6D5CE8" />

                <div className="hidden md:block">

                  <p className="text-sm font-bold">Ansh Kumar</p>

                  <p className="text-[11px] text-slate-400">Administrator</p>

                </div>

                <ChevronDown size={15} className="hidden md:block text-slate-400" />

              </div>

            </div>

          </header>



          <div className="p-5 md:p-8 max-w-[1500px] mx-auto">



            {/* OVERVIEW */}

            {active === 'Overview' && (

              <>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">

                  <div>

                    <p className="text-sm text-slate-400 mb-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>

                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Your agency at a glance.</h1>

                    <p className="text-sm text-slate-400 mt-2">Here's what's happening in your workspace today.</p>

                  </div>

                  <button onClick={() => setModal('project')} className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm shadow-lg shadow-violet-500/20">

                    <Plus size={18} /> New Project

                  </button>

                </div>



                {/* STAT CARDS */}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">

                  {stats.map((stat, i) => {

                    const Icon = stat.icon

                    return (

                      <div key={i} className="bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 hover:-translate-y-1 transition-transform">

                        <div className="flex items-center justify-between">

                          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: stat.color + '18', color: stat.color }}>

                            <Icon size={21} />

                          </div>

                          <span className="text-[10px] font-semibold text-slate-400">Live data</span>

                        </div>

                        <p className="text-sm text-slate-400 mt-5">{stat.label}</p>

                        <div className="flex items-end justify-between mt-1">

                          <h3 className="text-3xl font-extrabold">{stat.value}</h3>

                          <span className="text-[10px] text-slate-400 text-right max-w-[110px]">{stat.detail}</span>

                        </div>

                      </div>

                    )

                  })}

                </div>



                {/* LIVE ANALYTICS */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-7">
                  <div className="xl:col-span-2 bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                      <div>
                        <h3 className="font-bold text-base">Project budget by month</h3>
                        <p className="text-xs text-slate-400 mt-1">Budgets of projects created in {currentYear} — not collected revenue</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-500">{money(totalProjectBudget)} total</span>
                    </div>
                    <div className="h-48 flex items-end justify-between gap-2 sm:gap-3 border-b border-slate-200 dark:border-white/10 pb-2">
                      {monthlyProjectBudgets.map((month) => {
                        const height = month.total ? Math.max((month.total / maxMonthlyBudget) * 100, 5) : 0
                        return (
                          <div key={month.label} className="flex-1 h-full flex flex-col justify-end items-center gap-2 group min-w-0">
                            <div className="w-full max-w-12 rounded-t-lg bg-violet-500/15 relative" style={{ height: `${height}%` }} title={`${month.label}: ${money(month.total)}`}>
                              {month.total > 0 && <div className="absolute inset-0 rounded-t-lg bg-gradient-to-t from-violet-600 to-indigo-400" />}
                            </div>
                            <span className="text-[9px] sm:text-[10px] text-slate-400">{month.label}</span>
                          </div>
                        )
                      })}
                    </div>
                    {projects.length === 0 && <p className="text-center text-xs text-slate-400 mt-4">Create projects with budgets to see analytics here.</p>}
                  </div>

                  <div className="bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 md:p-6">
                    <h3 className="font-bold">Project status</h3>
                    <p className="text-xs text-slate-400 mt-1">Live project breakdown</p>
                    <div className="flex justify-center py-5">
                      <div className="w-36 h-36 rounded-full flex items-center justify-center" style={{ background: projects.length ? `conic-gradient(${projectStatusCounts.map((item, index) => {
                        const before = projectStatusCounts.slice(0, index).reduce((sum, entry) => sum + entry.count, 0)
                        const start = (before / projects.length) * 100
                        const end = ((before + item.count) / projects.length) * 100
                        return `${item.color} ${start}% ${end}%`
                      }).join(', ')})` : 'conic-gradient(#64748b 0% 100%)' }}>
                        <div className="w-24 h-24 rounded-full bg-white dark:bg-[#151B28] flex flex-col items-center justify-center">
                          <span className="text-3xl font-extrabold">{projects.length}</span>
                          <span className="text-[10px] text-slate-400">Projects</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {projectStatusCounts.map(item => (
                        <div key={item.label} className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-2 text-slate-400"><span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />{item.label}</span>
                          <span className="font-bold">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-7">
                  <div className="xl:col-span-2 bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 md:p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="font-bold">Lead pipeline</h3>
                        <p className="text-xs text-slate-400 mt-1">Current lead status distribution</p>
                      </div>
                      <button onClick={() => setActive('Leads')} className="text-xs text-violet-500 font-semibold">Manage leads <ArrowUpRight size={13} className="inline" /></button>
                    </div>
                    <div className="space-y-4">
                      {leadStatusCounts.map(item => (
                        <div key={item.label}>
                          <div className="flex justify-between text-xs mb-2"><span className="text-slate-400">{item.label}</span><span className="font-bold">{item.count}</span></div>
                          <div className="h-2 rounded-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${leads.length ? (item.count / leads.length) * 100 : 0}%`, background: item.color }} /></div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-5">{conversionRate}% of all leads are marked converted.</p>
                  </div>

                  <div className="bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 md:p-6">
                    <h3 className="font-bold">Attention needed</h3>
                    <p className="text-xs text-slate-400 mt-1">Items that may need follow-up</p>
                    <div className="mt-6 space-y-5">
                      <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">Overdue projects</p><p className="text-xs text-slate-400 mt-1">Past deadline, not completed</p></div><span className={`text-xl font-extrabold ${overdueProjects ? 'text-rose-500' : 'text-emerald-500'}`}>{overdueProjects}</span></div>
                      <div className="h-px bg-slate-100 dark:bg-white/[0.06]" />
                      <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">New leads</p><p className="text-xs text-slate-400 mt-1">Waiting for first contact</p></div><span className="text-xl font-extrabold text-sky-500">{leads.filter(lead => lead.status === 'New').length}</span></div>
                      <div className="h-px bg-slate-100 dark:bg-white/[0.06]" />
                      <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">Active clients</p><p className="text-xs text-slate-400 mt-1">Currently marked active</p></div><span className="text-xl font-extrabold text-violet-500">{clients.filter(client => client.status === 'Active').length}</span></div>
                    </div>
                  </div>
                </div>

                {/* RECENT PROJECTS AND CLIENTS */}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                  <div className="bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5">

                    <div className="flex justify-between items-center mb-5">

                      <div>

                        <h3 className="font-bold">Recent projects</h3>

                        <p className="text-xs text-slate-400 mt-1">Your latest work</p>

                      </div>

                      <button onClick={() => setActive('Projects')} className="text-xs text-violet-500 font-semibold">View all <ArrowUpRight size={13} className="inline" /></button>

                    </div>

                    <div className="space-y-5">

                      {projects.slice(0, 4).map(p => (

                        <div key={p.id}>

                          <div className="flex items-center justify-between gap-2 mb-2">

                            <div className="min-w-0">

                              <p className="text-sm font-semibold truncate">{p.name}</p>

                              <p className="text-xs text-slate-400 mt-1">{p.client}</p>

                            </div>

                            <span className="text-xs font-bold">{p.progress}%</span>

                          </div>

                          <div className="h-1.5 bg-slate-100 dark:bg-white/[0.07] rounded-full overflow-hidden">

                            <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.color }} />

                          </div>

                        </div>

                      ))}

                    </div>

                  </div>



                  <div className="bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5">

                    <div className="flex justify-between items-center mb-5">

                      <div>

                        <h3 className="font-bold">Recent clients</h3>

                        <p className="text-xs text-slate-400 mt-1">Your latest customers</p>

                      </div>

                      <button onClick={() => setActive('Clients')} className="text-xs text-violet-500 font-semibold">View all <ArrowUpRight size={13} className="inline" /></button>

                    </div>

                    <div className="space-y-4">

                      {clients.slice(0, 4).map(c => (

                        <div key={c.id} className="flex items-center gap-3">

                          <Avatar name={c.name} color={c.color} />

                          <div className="flex-1 min-w-0">

                            <p className="text-sm font-semibold truncate">{c.name}</p>

                            <p className="text-xs text-slate-400">{c.company}</p>

                          </div>

                          <Badge>{c.status}</Badge>

                        </div>

                      ))}

                    </div>

                  </div>

                </div>

              </>

            )}



            {/* CLIENTS PAGE */}

            {active === 'Clients' && (

              <div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">

                  <div>

                    <h1 className="text-2xl md:text-3xl font-extrabold">Clients</h1>

                    <p className="text-sm text-slate-400 mt-2">Manage your agency relationships.</p>

                  </div>

                  <button onClick={() => setModal('client')} className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm"><Plus size={18} /> Add Client</button>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

                  <div className="p-5 bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl"><p className="text-xs text-slate-400">Total clients</p><h2 className="text-3xl font-extrabold mt-2">{clients.length}</h2></div>

                  <div className="p-5 bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl"><p className="text-xs text-slate-400">Active clients</p><h2 className="text-3xl font-extrabold mt-2">{clients.filter(c => c.status === 'Active').length}</h2></div>

                  <div className="p-5 bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl"><p className="text-xs text-slate-400">Pending clients</p><h2 className="text-3xl font-extrabold mt-2">{clients.filter(c => c.status === 'Pending').length}</h2></div>

                </div>

                {clientsLoading && (
                  <p className="text-sm text-slate-400 mb-4">Loading your clients...</p>
                )}

                <div className="bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl overflow-hidden">

                  <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06]">

                    <h3 className="font-bold">All clients <span className="text-slate-400 font-normal">({filteredClients.length})</span></h3>

                    <button className="text-xs text-slate-400 flex items-center gap-2"><Filter size={15} /> Filter</button>

                  </div>

                  <div className="overflow-x-auto">

                    <table className="w-full text-left min-w-[650px]">

                      <thead className="bg-slate-50 dark:bg-white/[0.025] text-[10px] uppercase tracking-wider text-slate-400">

                        <tr><th className="px-5 py-4">Client</th><th className="px-5 py-4">Company</th><th className="px-5 py-4">Joined</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Action</th></tr>

                      </thead>

                      <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">

                        {filteredClients.map(c => (

                          <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">

                            <td className="px-5 py-4"><div className="flex items-center gap-3"><Avatar name={c.name} color={c.color} /><div><p className="text-sm font-semibold">{c.name}</p><p className="text-xs text-slate-400">{c.email}</p></div></div></td>

                            <td className="px-5 py-4 text-sm text-slate-400">{c.company}</td>

                            <td className="px-5 py-4 text-sm text-slate-400">{c.date}</td>

                            <td className="px-5 py-4"><Badge>{c.status}</Badge></td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setEditingClient(c)
                                    setClientForm({ name: c.name, email: c.email, company: c.company })
                                    setModal('editClient')
                                  }}
                                  className="p-2 rounded-lg hover:bg-violet-500/10 text-slate-400 hover:text-violet-500"
                                  title="Edit client"
                                >
                                  <FileText size={16} />
                                </button>
                                <button
                                  onClick={() => removeClient(c.id)}
                                  className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500"
                                  title="Delete client"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                    {filteredClients.length === 0 && <p className="p-8 text-center text-sm text-slate-400">No clients found.</p>}

                  </div>

                </div>

              </div>

            )}



            {/* PROJECTS PAGE */}

            {active === 'Projects' && (

              <div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">

                  <div><h1 className="text-2xl md:text-3xl font-extrabold">Projects</h1><p className="text-sm text-slate-400 mt-2">Track work and deliverables.</p></div>

                  <button onClick={() => setModal('project')} className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm"><Plus size={18} /> New Project</button>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

                  {[['All Projects', projects.length], ['In Progress', projects.filter(p => p.status === 'In Progress').length], ['Completed', projects.filter(p => p.status === 'Completed').length]].map(([label, value]) => (

                    <div key={label} className="p-5 bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl"><p className="text-xs text-slate-400">{label}</p><h2 className="text-3xl font-extrabold mt-2">{value}</h2></div>

                  ))}

                </div>

                {projectsLoading && <p className="text-sm text-slate-400 mb-4">Loading your projects...</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredProjects.map(p => (
                    <div key={p.id} className="bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 hover:-translate-y-1 transition-transform">
                      <div className="flex justify-between items-start">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: p.color + '18', color: p.color }}><Briefcase size={21} /></div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setEditingProject(p); setProjectForm({ name: p.name, clientId: p.clientId || '', due: p.due || '', budget: String(p.budget || ''), progress: p.progress, status: p.status }); setModal('editProject') }} className="p-2 text-slate-400 hover:text-violet-500" title="Edit project"><FileText size={16} /></button>
                          <button onClick={() => removeProject(p.id)} className="p-2 text-slate-400 hover:text-red-500" title="Delete project"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <h3 className="font-bold mt-5">{p.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{p.client || 'No client assigned'}</p>
                      <p className="text-xs text-slate-400 mt-2">Budget: {money(p.budget || 0)}</p>
                      <div className="flex justify-between items-center mt-6 mb-2"><span className="text-xs text-slate-400">Progress</span><span className="text-xs font-bold">{p.progress}%</span></div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-white/[0.07] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.color }} /></div>
                      <div className="flex justify-between items-center mt-5 gap-2"><Badge>{p.status}</Badge><span className="text-xs text-slate-400 flex items-center gap-1"><CalendarDays size={13} /> {p.due || 'No deadline'}</span></div>
                    </div>
                  ))}
                </div>

                {!projectsLoading && filteredProjects.length === 0 && <p className="text-center p-10 text-slate-400">No projects found. Create your first project!</p>}

              </div>

            )}



            {/* LEADS PAGE */}
            {active === 'Leads' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold">Leads & Enquiries</h1>
                    <p className="text-sm text-slate-400 mt-2">Manage prospects and turn enquiries into clients.</p>
                  </div>
                  <button onClick={() => { setLeadForm({ name: '', email: '', company: '', service: '' }); setEditingLead(null); setModal('lead') }} className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm">
                    <Plus size={18} /> Add Lead
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    ['Total leads', leads.length],
                    ['New', leads.filter(l => l.status === 'New').length],
                    ['Contacted', leads.filter(l => l.status === 'Contacted').length],
                    ['Converted', leads.filter(l => l.status === 'Converted').length]
                  ].map(([label, value]) => (
                    <div key={label} className="p-5 bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl">
                      <p className="text-xs text-slate-400">{label}</p>
                      <h2 className="text-3xl font-extrabold mt-2">{value}</h2>
                    </div>
                  ))}
                </div>

                <div className="bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">All leads <span className="text-slate-400 font-normal">({filteredLeads.length})</span></h3>
                      <p className="text-xs text-slate-400 mt-1">Search, update, edit or remove enquiries.</p>
                    </div>
                    <span className="text-xs text-slate-400">{leadsLoading ? 'Loading...' : `${leads.length} records`}</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left">
                      <thead className="bg-slate-50 dark:bg-white/[0.025] text-[10px] uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-5 py-4">Contact</th>
                          <th className="px-5 py-4">Company</th>
                          <th className="px-5 py-4">Service</th>
                          <th className="px-5 py-4">Received</th>
                          <th className="px-5 py-4">Status</th>
                          <th className="px-5 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                        {filteredLeads.map(l => (
                          <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                            <td className="px-5 py-4">
                              <p className="text-sm font-semibold">{l.name}</p>
                              <p className="text-xs text-slate-400">{l.email}</p>
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-400">{l.company || '—'}</td>
                            <td className="px-5 py-4 text-sm text-slate-400">{l.service || '—'}</td>
                            <td className="px-5 py-4 text-sm text-slate-400">{l.date}</td>
                            <td className="px-5 py-4">
                              <select value={l.status} onChange={e => changeLeadStatus(l.id, e.target.value)} className="text-xs p-2 rounded-lg bg-slate-100 dark:bg-[#202838] border-0 outline-none">
                                <option>New</option>
                                <option>Contacted</option>
                                <option>Converted</option>
                                <option>Lost</option>
                              </select>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => { setEditingLead(l); setLeadForm({ name: l.name, email: l.email, company: l.company, service: l.service }); setModal('editLead') }} className="p-2 rounded-lg hover:bg-violet-500/10 text-slate-400 hover:text-violet-500" title="Edit lead">
                                  <FileText size={16} />
                                </button>
                                <button onClick={() => removeLead(l.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500" title="Delete lead">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!leadsLoading && filteredLeads.length === 0 && <p className="p-8 text-center text-sm text-slate-400">No leads found. Add your first lead!</p>}
                  </div>
                </div>
              </div>
            )}

            {/* TASKS PAGE */}
            {active === 'Tasks' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold">Tasks & Deadlines</h1>
                    <p className="text-sm text-slate-400 mt-2">Plan work, track progress and stay on top of deadlines.</p>
                  </div>
                  <button onClick={() => { setEditingTask(null); setTaskForm({ title: '', projectId: '', dueDate: '' }); setModal('task') }} className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm">
                    <Plus size={18} /> Add Task
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {[
                    ['Total tasks', tasks.length],
                    ['Completed', tasks.filter(task => task.completed).length],
                    ['To do', tasks.filter(task => !task.completed).length]
                  ].map(([label, value]) => (
                    <div key={label} className="p-5 bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl">
                      <p className="text-xs text-slate-400">{label}</p>
                      <h2 className="text-3xl font-extrabold mt-2">{value}</h2>
                    </div>
                  ))}
                </div>

                <div className="bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                    <div><h3 className="font-bold">All tasks ({filteredTasks.length})</h3><p className="text-xs text-slate-400 mt-1">Tick tasks off as you complete them.</p></div>
                    <span className="text-xs text-slate-400">{tasksLoading ? 'Loading...' : `${tasks.length} records`}</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                    {filteredTasks.map(task => (
                      <div key={task.id} className="px-5 py-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task)} className="w-5 h-5 accent-violet-600 shrink-0 cursor-pointer" aria-label="Mark task complete" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold ${task.completed ? 'line-through text-slate-400' : ''}`}>{task.title}</p>
                          <p className="text-xs text-slate-400 mt-1">{task.project} · Due: {task.dueDate || 'No deadline'}</p>
                        </div>
                        <Badge>{task.completed ? 'Completed' : 'New'}</Badge>
                        <button onClick={() => { setEditingTask(task); setTaskForm({ title: task.title, projectId: task.projectId, dueDate: task.dueDate }); setModal('editTask') }} className="p-2 rounded-lg text-slate-400 hover:text-violet-500 hover:bg-violet-500/10" title="Edit task"><FileText size={16} /></button>
                        <button onClick={() => removeTask(task.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10" title="Delete task"><Trash2 size={16} /></button>
                      </div>
                    ))}
                    {!tasksLoading && filteredTasks.length === 0 && <p className="p-10 text-center text-sm text-slate-400">No tasks yet. Add your first task!</p>}
                  </div>
                </div>
              </div>
            )}

            {/* REPORTS PAGE */}
            {active === 'Reports' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold">Reports & Insights</h1>
                    <p className="text-sm text-slate-400 mt-2">A live snapshot of the records in your AgencyOS workspace.</p>
                  </div>
                  <button onClick={() => window.print()} className="px-5 py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold">Print report</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                  {[
                    ['Clients', clients.length, Users],
                    ['Projects', projects.length, FolderKanban],
                    ['Leads', leads.length, Target],
                    ['Tasks completed', tasks.filter(task => task.completed).length, CheckCircle2]
                  ].map(([label, value, Icon]) => (
                    <div key={label} className="p-5 bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl">
                      <div className="flex items-center justify-between"><p className="text-xs text-slate-400">{label}</p><Icon size={19} className="text-violet-500" /></div>
                      <h2 className="text-3xl font-extrabold mt-3">{value}</h2>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <div className="bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5">
                    <h3 className="font-bold mb-4">Project status summary</h3>
                    <div className="space-y-4">
                      {projectStatusCounts.map(item => (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-2"><span>{item.label}</span><strong>{item.count}</strong></div>
                          <div className="h-2 rounded-full bg-slate-100 dark:bg-white/[0.07] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${projects.length ? item.count / projects.length * 100 : 0}%`, background: item.color }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5">
                    <h3 className="font-bold mb-4">Lead pipeline</h3>
                    <div className="space-y-4">
                      {leadStatusCounts.map(item => (
                        <div key={item.label} className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-slate-400"><span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />{item.label}</span><strong>{item.count}</strong></div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/[0.06] flex justify-between"><span className="text-sm text-slate-400">Lead conversion rate</span><strong>{conversionRate}%</strong></div>
                  </div>
                  <div className="bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5">
                    <h3 className="font-bold mb-4">Task completion</h3>
                    <p className="text-3xl font-extrabold">{tasks.length ? Math.round(tasks.filter(task => task.completed).length / tasks.length * 100) : 0}%</p>
                    <p className="text-xs text-slate-400 mt-1">{tasks.filter(task => task.completed).length} of {tasks.length} tasks completed</p>
                  </div>
                  <div className="bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5">
                    <h3 className="font-bold mb-4">Project budget overview</h3>
                    <p className="text-3xl font-extrabold">{money(totalProjectBudget)}</p>
                    <p className="text-xs text-slate-400 mt-1">Total recorded project budgets — not revenue received</p>
                    <p className="text-sm text-amber-500 mt-4">{overdueProjects} overdue active projects</p>
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS PAGE */}
            {active === 'Settings' && (
              <div>
                <div className="mb-7">
                  <h1 className="text-2xl md:text-3xl font-extrabold">Settings</h1>
                  <p className="text-sm text-slate-400 mt-2">Manage your account profile and workspace preferences.</p>
                </div>
                <div className="max-w-2xl bg-white dark:bg-[#151B28] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-6">
                  <h3 className="font-bold text-lg">Account profile</h3>
                  <p className="text-xs text-slate-400 mt-1 mb-6">Your email is managed by Supabase Authentication.</p>
                  <form onSubmit={saveProfile} className="space-y-5">
                    <div>
                      <label className="text-xs font-semibold text-slate-400">Display name</label>
                      <input value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Your name" className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none focus:border-violet-500 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400">Account email</label>
                      <input value={profileEmail} readOnly className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none text-sm opacity-70" />
                    </div>
                    <button disabled={profileSaving} className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold text-sm">{profileSaving ? 'Saving...' : 'Save profile'}</button>
                  </form>
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/[0.06]">
                    <h3 className="font-bold">Appearance</h3>
                    <p className="text-xs text-slate-400 mt-1 mb-4">Choose the dashboard theme for this session.</p>
                    <div className="flex gap-3">
                      <button onClick={() => setDark(false)} className={`px-4 py-2 rounded-xl border text-sm ${!dark ? 'border-violet-500 text-violet-500' : 'border-slate-200 dark:border-white/10'}`}><Sun size={15} className="inline mr-2"/>Light</button>
                      <button onClick={() => setDark(true)} className={`px-4 py-2 rounded-xl border text-sm ${dark ? 'border-violet-500 text-violet-500' : 'border-slate-200 dark:border-white/10'}`}><Moon size={15} className="inline mr-2"/>Dark</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FOOTER */}

            <footer className="mt-10 py-5 border-t border-slate-200 dark:border-white/[0.06] flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-400">

              <span>© 2026 AgencyOS. All rights reserved.</span>

              <span className="flex items-center gap-1">Crafted with <span className="text-violet-500">♥</span> for growing agencies.</span>

            </footer>

          </div>

        </main>



        {/* ADD CLIENT MODAL */}

        {modal === 'client' && (

          <Modal title="Add a new client" onClose={() => setModal('')}>

            <form onSubmit={addClient} className="space-y-4">

              <div><label className="text-xs font-semibold text-slate-400">Client name</label><input required value={clientForm.name} onChange={e => setClientForm({ ...clientForm, name: e.target.value })} placeholder="e.g. Acme Studio" className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none focus:border-violet-500 text-sm" /></div>

              <div><label className="text-xs font-semibold text-slate-400">Email address</label><input required type="email" value={clientForm.email} onChange={e => setClientForm({ ...clientForm, email: e.target.value })} placeholder="client@example.com" className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none focus:border-violet-500 text-sm" /></div>

              <div><label className="text-xs font-semibold text-slate-400">Company / Industry</label><input required value={clientForm.company} onChange={e => setClientForm({ ...clientForm, company: e.target.value })} placeholder="e.g. Technology" className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none focus:border-violet-500 text-sm" /></div>

              <button className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm">Create Client</button>

            </form>

          </Modal>

        )}



        {/* EDIT CLIENT MODAL */}
        {modal === 'editClient' && (
          <Modal
            title="Edit client"
            onClose={() => {
              setModal('')
              setEditingClient(null)
              setClientForm({ name: '', email: '', company: '' })
            }}
          >
            <form onSubmit={updateClient} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400">Client name</label>
                <input
                  required
                  value={clientForm.name}
                  onChange={e => setClientForm({ ...clientForm, name: e.target.value })}
                  className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400">Email address</label>
                <input
                  required
                  type="email"
                  value={clientForm.email}
                  onChange={e => setClientForm({ ...clientForm, email: e.target.value })}
                  className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400">Company / Industry</label>
                <input
                  required
                  value={clientForm.company}
                  onChange={e => setClientForm({ ...clientForm, company: e.target.value })}
                  className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none text-sm"
                />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm">
                Save Changes
              </button>
            </form>
          </Modal>
        )}


        {/* ADD / EDIT PROJECT MODAL */}
        {(modal === 'project' || modal === 'editProject') && (
          <Modal
            title={modal === 'editProject' ? 'Edit project' : 'Create a new project'}
            onClose={() => {
              setModal('')
              setEditingProject(null)
              setProjectForm({ name: '', clientId: '', due: '', budget: '', progress: 0, status: 'In Progress' })
            }}
          >
            <form onSubmit={modal === 'editProject' ? updateProject : addProject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400">Project name</label>
                <input required value={projectForm.name} onChange={e => setProjectForm({ ...projectForm, name: e.target.value })} placeholder="e.g. Website Development" className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none focus:border-violet-500 text-sm" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Client</label>
                <select value={projectForm.clientId} onChange={e => setProjectForm({ ...projectForm, clientId: e.target.value })} className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none text-sm">
                  <option value="">No client assigned</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Project budget (₹)</label>
                <input type="number" min="0" value={projectForm.budget} onChange={e => setProjectForm({ ...projectForm, budget: e.target.value })} placeholder="e.g. 25000" className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none text-sm" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Deadline</label>
                <input type="date" value={projectForm.due} onChange={e => setProjectForm({ ...projectForm, due: e.target.value })} className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none text-sm" />
              </div>

              {modal === 'editProject' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Progress: {projectForm.progress}%</label>
                    <input type="range" min="0" max="100" value={projectForm.progress} onChange={e => setProjectForm({ ...projectForm, progress: Number(e.target.value) })} className="w-full mt-3 accent-violet-600" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Status</label>
                    <select value={projectForm.status} onChange={e => setProjectForm({ ...projectForm, status: e.target.value })} className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none text-sm">
                      <option>In Progress</option>
                      <option>On Hold</option>
                      <option>Completed</option>
                    </select>
                  </div>
                </>
              )}

              <button type="submit" className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm">
                {modal === 'editProject' ? 'Save Changes' : 'Create Project'}
              </button>
            </form>
          </Modal>
        )}


        {/* ADD / EDIT LEAD MODAL */}
        {(modal === 'lead' || modal === 'editLead') && (
          <Modal
            title={modal === 'editLead' ? 'Edit lead' : 'Add a new lead'}
            onClose={() => {
              setModal('')
              setEditingLead(null)
              setLeadForm({ name: '', email: '', company: '', service: '' })
            }}
          >
            <form onSubmit={modal === 'editLead' ? updateLead : addLead} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400">Contact name</label>
                <input required value={leadForm.name} onChange={e => setLeadForm({ ...leadForm, name: e.target.value })} placeholder="e.g. Rahul Sharma" className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none focus:border-violet-500 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400">Email address</label>
                <input required type="email" value={leadForm.email} onChange={e => setLeadForm({ ...leadForm, email: e.target.value })} placeholder="rahul@example.com" className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none focus:border-violet-500 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400">Company</label>
                <input value={leadForm.company} onChange={e => setLeadForm({ ...leadForm, company: e.target.value })} placeholder="e.g. Acme Technologies" className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none focus:border-violet-500 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400">Service interested in</label>
                <input value={leadForm.service} onChange={e => setLeadForm({ ...leadForm, service: e.target.value })} placeholder="e.g. Website Development" className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none focus:border-violet-500 text-sm" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm">
                {modal === 'editLead' ? 'Save Changes' : 'Create Lead'}
              </button>
            </form>
          </Modal>
        )}

        {/* ADD / EDIT TASK MODAL */}
        {(modal === 'task' || modal === 'editTask') && (
          <Modal title={modal === 'editTask' ? 'Edit task' : 'Create a task'} onClose={() => { setModal(''); setEditingTask(null); setTaskForm({ title: '', projectId: '', dueDate: '' }) }}>
            <form onSubmit={modal === 'editTask' ? updateTask : addTask} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400">Task title</label>
                <input required value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="e.g. Prepare homepage design" className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none focus:border-violet-500 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400">Related project</label>
                <select value={taskForm.projectId} onChange={e => setTaskForm({ ...taskForm, projectId: e.target.value })} className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none text-sm">
                  <option value="">No project assigned</option>
                  {projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400">Due date</label>
                <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 outline-none text-sm" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm">{modal === 'editTask' ? 'Save Changes' : 'Create Task'}</button>
            </form>
          </Modal>
        )}

        {/* TOAST */}

        {notification && (

          <div className="fixed bottom-6 right-6 z-[60] bg-slate-900 dark:bg-violet-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold">

            <CheckCircle2 size={18} /> {notification}

          </div>

        )}

      </div>

    </div>

  )

}



function App() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession()
      if (mounted) {
        if (error) console.error('Session error:', error.message)
        setSession(data?.session ?? null)
        setChecking(false)
      }
    }

    loadSession()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setChecking(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0D111B] flex items-center justify-center text-white">
        Loading AgencyOS...
      </div>
    )
  }

  return session ? <Dashboard /> : <Auth />
}

export default App
