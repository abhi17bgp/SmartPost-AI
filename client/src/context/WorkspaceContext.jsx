import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/axiosInstance';
import { useAuth } from './AuthContext';

const WorkspaceContext = createContext();

export const useWorkspace = () => useContext(WorkspaceContext);

export const WorkspaceProvider = ({ children }) => {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [collections, setCollections] = useState([]);
  const [savedRequests, setSavedRequests] = useState([]);
  const [history, setHistory] = useState([]);
  
  // Tabs representing open requests in the main pane
  const [tabs, setTabs] = useState([{ id: 'new', title: 'Untitled Request', isNew: true }]);
  const [activeTabId, setActiveTabId] = useState('new');
  
  // Shared Response State for tabs
  const [responseData, setResponseData] = useState({});
  const [responseLoading, setResponseLoading] = useState({});
  const [responseAi, setResponseAi] = useState({});
  const [responseAiLoading, setResponseAiLoading] = useState({});
  const [latestHistoryId, setLatestHistoryId] = useState({});

  const fetchWorkspaces = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/workspaces');
      if (res.data.data.workspaces.length > 0) {
        setWorkspaces(res.data.data.workspaces);
        setCurrentWorkspace(res.data.data.workspaces[0]);
      } else {
        // Automatically provision a default workspace if the user has none
        const createRes = await api.post('/workspaces', { name: 'My Workspace' });
        const newWorkspace = createRes.data.data.workspace;
        setWorkspaces([newWorkspace]);
        setCurrentWorkspace(newWorkspace);
      }
    } catch (err) {
      console.error('Failed to fetch workspaces', err);
    }
  }, [user]);

  const fetchCollections = useCallback(async () => {
    if (!currentWorkspace) return;
    try {
      const res = await api.get(`/collections?workspaceId=${currentWorkspace._id}`);
      setCollections(res.data.data.collections || []);
      setSavedRequests(res.data.data.requests || []);
    } catch (err) {
      console.error('Failed to fetch collections', err);
    }
  }, [currentWorkspace]);

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/history');
      setHistory(res.data.data.history || []);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  }, [user]);

  useEffect(() => {
    fetchWorkspaces();
    fetchHistory();
  }, [fetchWorkspaces, fetchHistory]);

  useEffect(() => {
    if (currentWorkspace) {
      fetchCollections();
    }
  }, [currentWorkspace, fetchCollections]);

  const value = {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    collections,
    savedRequests,
    fetchCollections,
    history,
    setHistory,
    fetchHistory,
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    responseData,
    setResponseData,
    responseLoading,
    setResponseLoading,
    responseAi,
    setResponseAi,
    responseAiLoading,
    setResponseAiLoading,
    latestHistoryId,
    setLatestHistoryId
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};
