CREATE FUNCTION createModel(descr text, brandId numeric, demoId numeric, tags numeric[])
RETURNS INTEGER
language plpgsql
AS
$$
DECLARE 
    myId INTEGER;
    tag INTEGER;
BEGIN
    INSERT INTO models(description, brand_id, demo_id) VALUES (descr, brandId, demoId) RETURNING id INTO myId;
    FOREACH tag IN ARRAY tags
    LOOP 
        INSERT INTO models_tags VALUES(myId, tag);
    END LOOP;   

    RETURN myId;  
END;
$$;
