const axios = require('axios');

const tempail = {
  api: {
    base: 'https://tempail.top/api',
    endpoints: {
      createEmail: '/email/create/ApiTempail',
      getMessages: (emailToken) => `/messages/${emailToken}/ApiTempail`,
      getMessage: (messageId) => `/message/${messageId}/ApiTempail`
    }
  },

  headers: {
    'user-agent': 'Postify/1.0.0',
  },

  deletedInTimestamp: null,

  createEmail: async function () {
    try {
      const response = await axios.post(
        `${this.api.base}${this.api.endpoints.createEmail}`,
        null,
        { headers: this.headers }
      );

      if (response.data.status !== 'success') {
        return {
          success: false,
          code: 500,
          result: { error: 'Gagal bikin email temp nya bree..' }
        };
      }

      const {
        email,
        email_token: emailToken,
        deleted_in: deletedIn
      } = response.data.data;

      this.deletedInTimestamp = new Date(deletedIn).getTime();

      return {
        success: true,
        code: 200,
        email,
        emailToken,
        deletedIn
      };

    } catch (err) {
      return {
        success: false,
        code: err.response?.status || 500,
        result: { error: err.message }
      };
    }
  },

  _isTempMailDeleted: function () {
    if (!this.deletedInTimestamp) return false;
    return Date.now() > this.deletedInTimestamp;
  },

  getMessages: async function (emailToken) {
    if (!emailToken || typeof emailToken !== 'string' || !emailToken.trim()) {
      return {
        success: false,
        code: 400,
        result: { error: 'Email token kagak boleh kosong yak bree, harus diisi.. 🗿' }
      };
    }

    if (this._isTempMailDeleted()) {
      return {
        success: false,
        code: 410,
        result: { error: 'Email Tempnya udah expired bree..' }
      };
    }

    try {
      const url = this.api.endpoints.getMessages(emailToken);
      const response = await axios.get(
        `${this.api.base}${url}`,
        { headers: this.headers }
      );

      if (response.data.status !== 'success') {
        return {
          success: false,
          code: 500,
          result: { error: 'Kagak bisa ngambil semua list pesan di Temp Mailnya bree... 🤣' }
        };
      }

      const { mailbox, messages } = response.data.data;

      return {
        success: true,
        code: 200,
        mailbox,
        messages
      };

    } catch (err) {
      return {
        success: false,
        code: err.response?.status || 500,
        result: { error: err.message }
      };
    }
  },

  getMessage: async function (messageId) {
    if (!messageId || typeof messageId !== 'string' || !messageId.trim()) {
      return {
        success: false,
        code: 400,
        result: { error: 'Message ID nya harus diisi bree, kagak kosong yak.. 🗿' }
      };
    }

    if (this._isTempMailDeleted()) {
      return {
        success: false,
        code: 410,
        result: { error: 'Email Tempnya udah expired bree..' }
      };
    }

    try {
      const url = this.api.endpoints.getMessage(messageId);
      const response = await axios.get(
        `${this.api.base}${url}`,
        { headers: this.headers }
      );

      if (response.data.status !== 'success') {
        return {
          success: false,
          code: 500,
          result: { error: 'Kagak bisa ambil pesannya bree 😂' }
        };
      }

      const [message] = response.data.data;

      return {
        success: true,
        code: 200,
        message: {
          subject: message.subject,
          isSeen: message.is_seen,
          from: message.from,
          fromEmail: message.from_email,
          receivedAt: message.receivedAt,
          id: message.id,
          attachments: message.attachments,
          content: message.content
        }
      };

    } catch (err) {
      return {
        success: false,
        code: err.response?.status || 500,
        result: { error: err.message }
      };
    }
  }
};

module.exports = tempail;