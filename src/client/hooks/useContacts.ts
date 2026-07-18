/**
 * useContacts Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import type { Contact, CreateContactInput } from '../types/api.js';
import { contactsService } from '../services/index.js';

interface UseContactsOptions {
  autoFetch?: boolean;
}

export function useContacts(options: UseContactsOptions = {}) {
  const { autoFetch = true } = options;

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await contactsService.getAll();
      setContacts(response.data || []);
    } catch (err) {
      setError(err);
      console.error('Error fetching contacts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createContact = async (data: CreateContactInput) => {
    const response = await contactsService.create(data);
    await fetchContacts();
    toast.success('Contact created successfully');
    return response.data;
  };

  const updateContact = async (id: number | string, data: Partial<CreateContactInput>) => {
    try {
      const response = await contactsService.update(id, data);
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === Number(id) ? { ...contact, ...data } : contact
        )
      );
      toast.success('Contact updated successfully');
      return response.data;
    } catch (err) {
      await fetchContacts();
      throw err;
    }
  };

  const deleteContact = async (id: number | string) => {
    try {
      await contactsService.delete(id);
      setContacts((prev) => prev.filter((contact) => contact.id !== Number(id)));
      toast.success('Contact deleted successfully');
    } catch (err) {
      await fetchContacts();
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchContacts();
    }
  }, [autoFetch, fetchContacts]);

  return {
    contacts,
    isLoading,
    error,
    refresh: fetchContacts,
    createContact,
    updateContact,
    deleteContact,
  };
}

export default useContacts;
