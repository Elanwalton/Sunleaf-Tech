import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/ViewQuote.module.css';
import CreateQuoteModal from '../components/QuoteModal';
import { useSnackbar } from 'notistack';

interface Quote {
  id: number;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  file_path: string;
  created_at: string;
}

const ViewQuote: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [quotesPerPage] = useState(10);
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [quotes, searchTerm, sortOrder]);

  const fetchQuotes = async () => {
    try {
      const response = await axios.get('/api/getQuote.php');
      const data = response.data;

      if (Array.isArray(data.data)) {
        setQuotes(data.data);
      } else {
        console.error("Unexpected data format:", data);
        setQuotes([]);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setQuotes([]);
    }
  };

  const applyFilters = () => {
    let updated = [...quotes];

    if (searchTerm.trim()) {
      updated = updated.filter(
        (q) =>
          q.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.quote_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    updated.sort((a, b) => {
      return sortOrder === 'newest'
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    setFilteredQuotes(updated);
    setCurrentPage(1);
  };

  const handleSend = async (quoteId: number) => {
    setSendingId(quoteId);

    try {
      await axios.post('/api/sendMailQuote.php', { quote_id: quoteId });
      enqueueSnackbar(`Quote #${quoteId} sent to customer.`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(`Failed to send quote #${quoteId}.`, { variant: 'error' });
      console.error("Send failed:", error);
    }

    setSendingId(null);
  };

  const handleDownload = (filePath: string, quoteNumber: string) => {
    enqueueSnackbar(`Quote ${quoteNumber} downloaded.`, { variant: 'info' });
  };

  const indexOfLastQuote = currentPage * quotesPerPage;
  const indexOfFirstQuote = indexOfLastQuote - quotesPerPage;
  const currentQuotes = filteredQuotes.slice(indexOfFirstQuote, indexOfLastQuote);
  const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search by name or quote no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className={styles.sortSelect}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
        <button className={styles.createButton} onClick={() => setShowModal(true)}>
          + Create Quote
        </button>
      </div>

      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <th>Quote No</th>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {currentQuotes.map((quote) => (
            <tr key={quote.id}>
              <td>{quote.quote_number}</td>
              <td>{quote.customer_name}</td>
              <td>{quote.customer_email}</td>
              <td>{new Date(quote.created_at).toLocaleDateString()}</td>
              <td>
                <a
                  href={quote.file_path}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionLink}
                  onClick={() => handleDownload(quote.file_path, quote.quote_number)}
                >
                  Download
                </a>
                <button
                  className={styles.actionButton}
                  onClick={() => handleSend(quote.id)}
                  disabled={sendingId === quote.id}
                >
                  {sendingId === quote.id ? 'Sending...' : 'Send to Email'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`${styles.pageButton} ${currentPage === i + 1 ? styles.active : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <CreateQuoteModal
          onClose={() => setShowModal(false)}
          onQuoteCreated={fetchQuotes}
        />
      )}
    </div>
  );
};

export default ViewQuote;
