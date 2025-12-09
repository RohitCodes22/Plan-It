import struct

def parse_mysql_point(data: bytes):
    """
    MySQL internal POINT format:
        4 bytes  : SRID (uint32, little-endian)
        WKB      : byte order + geom type + X + Y
    Returns: (srid, x, y)
    """

    srid = struct.unpack("<I", data[:4])[0]

    byte_order = data[4]
    endian = "<" if byte_order == 1 else ">"

    geom_type = struct.unpack(endian + "I", data[5:9])[0]
    if geom_type != 1:
        print("NOT A POINT TYPE")
        return (None, None, None)

    x, y = struct.unpack(endian + "dd", data[9:25])

    return {
        "SRID": srid,
        "x": x,
        "y": y
    }
    
if __name__ == "__main__":
    test_val = b'\xe6\x10\x00\x00\x01\x01\x00\x00\x00\x81x]\xbf`\xf1V\xc0\x94h\xc9\xe3i\xf9B@'
    print(parse_mysql_point(test_val))