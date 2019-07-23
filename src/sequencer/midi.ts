
export function parseMidiData(data) {
  let offset = 0

  function readInt(bytes) {
    let value = 0
    while (bytes-- > 0) {
      value = value << 8 | data[offset++]
    }
    return value
  }

  function readVInt() {
    let value = 0
    while (data[offset] >= 128) {
      value = value << 7 | data[offset++]
    }
    return value << 7 | data[offset++]
  }

  const messages = [];

  while (offset < data.length) {
    const type = readInt(4)
    const length = readInt(4)
    const chunkEnd = offset + length;

    if (type === 0x4D54726B) {
      const chunk = []

      let time = 0
      let eventType = 0
      let channel = 0
      let type = 0

      while (offset < chunkEnd) {
        time += readVInt()
        const byte = readInt(1)

        if (byte & 0x80) {
          eventType = byte
          channel = byte & 0x0f
          type = byte & 0xf0 >> 4
        } else {
          offset -= 1
        }

        if (type === 0xf) {
          offset += readVInt()
        } else if (type === 0xc || type === 0xd) {
          chunk.push({ channel, time, data: [eventType, readInt(1)] })
        } else {
          chunk.push({ channel, time, data: [eventType, readInt(1), readInt(1)] })
        }
      }

      messages.push(chunk)
    }
    offset = chunkEnd;
  }

  return messages
}

