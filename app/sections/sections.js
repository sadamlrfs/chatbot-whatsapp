async function sendText(wa, to, body) {
  const message = {
    body,
    preview_url: false
  };

  await wa.messages.text(message, to);
}

async function firtMessage(wa, to) {
  const button_message = {
    type: 'button',
    header: {
      type: 'text',
      text: 'BPJS KETENAGAKERJAAN'
    },
    body: {
      text: 'Silahkan, anda dapat memperoleh informasi dengan memilih layanan berikut:'
    },
    action: {
      buttons: [
        {
          type: 'reply',
          reply: {
            id: 'pendaftaran',
            title: 'Pendaftaran Peserta'
          }
        },
        {
          type: 'reply',
          reply: {
            id: 'pelayanan',
            title: 'Pelayanan Jaminan'
          }
        },
        {
          type: 'reply',
          reply: {
            id: 'informasi',
            title: 'Informasi'
          }
        }
      ]
    }
  };

  await wa.messages.interactive(button_message, to);
}

async function pendaftaranPeserta(wa, to) {
  const list_message = {
    type: 'list',
    header: {
      type: 'text',
      text: 'PENDAFTARAN PESERTA'
    },
    body: {
      text: 'Silahkan pilih pendaftaran yang diinginkan'
    },
    action: {
      button: 'Lihat Pilihan',
      sections: [
        {
          title: 'Menu Pendaftaran',
          rows: [
            {
              id: 'pendaftaran_peserta',
              title: 'Pendaftaran Peserta',
              description: ''
            },
            {
              id: 'pendaftaran_bpu',
              title: 'Pendaftaran Peserta BPU',
              description: ''
            },
            {
              id: 'pendaftaran_pmi',
              title: 'Pendaftaran PMI',
              description: ''
            },
            {
              id: 'pendaftaran_jakon',
              title: 'Pendaftaran Jakon',
              description: ''
            }
          ]
        }
      ]
    }
  };

  await wa.messages.interactive(list_message, to);
}

async function pelayananJaminan(wa, to) {
  const list_message = {
    type: 'list',
    header: {
      type: 'text',
      text: 'PELAYANAN KLAIM JAMINAN'
    },
    body: {
      text: 'Silahkan pilih jaminan yang ingin anda klaim'
    },
    action: {
      button: 'Lihat Pilihan',
      sections: [
        {
          title: 'Menu Pelayanan Klaim',
          rows: [
            {
              id: 'klaim_jht',
              title: 'Klaim JHT',
              description: ''
            },
            {
              id: 'klaim_jkk',
              title: 'Klaim JKK',
              description: ''
            },
            {
              id: 'klaim_jkm',
              title: 'Klaim JKM',
              description: ''
            },
            {
              id: 'klaim_jp',
              title: 'Klaim JP',
              description: ''
            },
            {
              id: 'klaim_jkp',
              title: 'Klaim JKP',
              description: ''
            }
          ]
        }
      ]
    }
  };

  await wa.messages.interactive(list_message, to);
}

async function informasiPelayanan(wa, to) {
  const list_message = {
    type: 'list',
    header: {
      type: 'text',
      text: 'INFORMASI KEPESERTAAN DAN PELAYANAN'
    },
    body: {
      text: 'Silahkan pilih informasi kepesertaan dan pelayanan yang diinginkan'
    },
    action: {
      button: 'Lihat Pilihan',
      sections: [
        {
          title: 'Menu Pelayanan Informasi',
          rows: [
            {
              id: 'info_saldo',
              title: 'Informasi Saldo',
              description: ''
            },
            {
              id: 'info_nomor',
              title: 'Informasi Nomor Kartu',
              description: ''
            },
            {
              id: 'info_iuran',
              title: 'Informasi Iuran',
              description: ''
            },
            {
              id: 'info_tagihan',
              title: 'Informasi Tagihan',
              description: ''
            },
            {
              id: 'info_rs',
              title: 'Informasi RS Kerjasama',
              description: ''
            }
          ]
        }
      ]
    }
  };

  await wa.messages.interactive(list_message, to);
}



module.exports = {
  sendText,
  firtMessage,
  pendaftaranPeserta,
  pelayananJaminan,
  informasiPelayanan
};

